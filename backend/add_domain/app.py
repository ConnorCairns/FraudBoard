import whois
import boto3
import json
from decimal import Decimal
import get_hosting_cost
import get_ad_cost
import scrape_text
import bart_mnli
from boto3.dynamodb.conditions import Key
import time
import os
import subprocess
import re
from datetime import datetime

TABLE = "domains"
COSTS_TABLE = "category_costs"
DATE_COLS = ["creation_date", "expiration_date", "updated_date"]
SECONDS_IN_YEAR = 31536000


def res(status, response): return {
    "statusCode": status,
    "headers": {
        "Content-Type": "application/json",
        'Access-Control-Allow-Headers': 'Content-Type',
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Methods': 'OPTIONS,POST, GET'
    },
    "body": response
}


def clean_data(data):
    if isinstance(data["domain_name"], list):
        data["domain_name"] = data["domain_name"][0]

    data["domain_name"] = data["domain_name"].lower()

    for date_col in DATE_COLS:
        if date_col in data:
            if isinstance(data[date_col], list):
                # data[date_col] = [str(date) for date in data[date_col]]
                data[date_col] = str(data[date_col][0])
            else:
                data[date_col] = str(data[date_col])

    data = {k: v for (k, v) in data.items() if v}


def get_domain_cost(tld, creation_date, expiration_date):
    route53 = boto3.client("route53domains", region_name="us-east-1")

    res = route53.list_prices(Tld=tld)

    if creation_date is None or expiration_date is None:
        return round(Decimal(res["Prices"][0]["RegistrationPrice"]["Price"]), 2)

    if isinstance(creation_date, list):
        creation_date = creation_date[0]
    if isinstance(expiration_date, list):
        expiration_date = expiration_date[0]

    years = (expiration_date - creation_date).total_seconds() // SECONDS_IN_YEAR

    domain_cost = res["Prices"][0]["RegistrationPrice"]["Price"] * years

    return round(Decimal(domain_cost), 2)


def handler(event, context):
    api_key = event["queryStringParameters"]["api_key"]
    env_api_key = os.environ.get("API_KEY")

    if api_key != env_api_key:
        return res(401, "Wrong API key")

    try:  # improve this at some point
        body = json.loads(event["body"])
        w = whois.whois(body["URL"])  # This call takes a while

        # if w.creation_date == None:
        #     res = subprocess.Popen(['whois', body["URL"]], stdout=subprocess.PIPE).communicate()[0]

        #     print(res.decode('utf-8'))

        #     try:
        #         creation_date_match = re.compile(r'Creation\sDate:\s*(.+)').search(res.decode('utf-8'))
        #         dateStr = creation_date_match.group(0).strip().split(' ')[-1]
        #         print(dateStr)

        #         date = datetime.strptime(dateStr, '%Y-%m-%d')
        #         print(date)

        #     except Exception as e:
        #         print("oh no")
        #         print(e)
        #         pass

        orig_creation_date = w.creation_date
        orig_expiration_date = w.expiration_date

        clean_data(w)

        # DOMAIN COST
        tld = body["URL"].split(".")[-1]
        w["domain_cost"] = get_domain_cost(
            tld, orig_creation_date, orig_expiration_date)

        # HOSTING COST
        nameserver = w["name_servers"][0] if isinstance(w["name_servers"], list) else w["name_servers"]

        nameserver = f"{nameserver.split('.')[-2]}.{nameserver.split('.')[-1]}"

        w["hosting_cost"] = round(Decimal(get_hosting_cost.handler(nameserver, body["URL"])), 2)

        # AD COST
        w["advertising_spend"] = round(Decimal(get_ad_cost.handler(body["URL"])), 2)

        # TOTAL COST
        total_spent = w["domain_cost"] + w["hosting_cost"] + w["advertising_spend"]
        w["total_spent"] = round(Decimal(total_spent), 2)

        # CATEGORY
        w["tokens"] = scrape_text.handler(f"{body['URL']}")

        w["category"] = bart_mnli.handler(w["tokens"])

        dynamo = boto3.resource("dynamodb").Table(TABLE)
        dynamo_cost = boto3.resource("dynamodb").Table(COSTS_TABLE)

        # CATEGORY COST
        response = dynamo_cost.query(KeyConditionExpression=Key(
            "category").eq(w["category"]), Limit=1, ScanIndexForward=False)

        cost = 0 if len(response['Items']) == 0 else response['Items'][0]['average_cost']
        count = 1 if len(response['Items']) == 0 else response['Items'][0]['count'] + 1
        total_category_spent = total_spent if len(response['Items']) == 0 \
            else response['Items'][0]['total_spent'] + total_spent

        new_cost = round(Decimal(cost + ((total_spent - cost) / count)), 2)

        cost_item = {
            "category": w["category"],
            "timeDate": int(time.time()),
            "average_cost": new_cost,
            "count": count,
            "total_spent": total_category_spent
        }

        # ALL CATEOGRY SPENT
        response = dynamo_cost.query(KeyConditionExpression=Key(
            "category").eq("all"), Limit=1, ScanIndexForward=False)

        overall_cost = 0 if len(response['Items']) == 0 else response['Items'][0]['average_cost']
        overall_count = 1 if len(response['Items']) == 0 else response['Items'][0]['count'] + 1
        total_overall_spent = total_spent if len(response['Items']) == 0 \
            else response['Items'][0]['total_spent'] + overall_cost

        new_overall_cost = Decimal(overall_cost + ((total_spent - overall_cost) / overall_count))

        overall_item = {
            "category": "all",
            "timeDate": int(time.time()),
            "average_cost": new_overall_cost,
            "count": overall_count,
            "total_spent": total_overall_spent
        }

        try:
            dynamo.put_item(
                Item=w, ConditionExpression="attribute_not_exists(domain_name)")

            dynamo_cost.put_item(
                Item=cost_item
            )

            dynamo_cost.put_item(
                Item=overall_item
            )

            return res(201, "Successfully added domain")
        except Exception as e:
            print(e)
            if e.__class__.__name__ == "ConditionalCheckFailedException":
                return res(409, "ConditionalCheckFailedException: Domain already exists")

            return res(500, "Internal server error")
    except Exception as e:
        print(e)
        return res(500, "Internal server error")


if __name__ == '__main__':
    # handler("https://www.hostblast.net/")
    # handler("https://www.namecheap.com/hosting/")
    # handler("https://www.interserver.net/")
    # event = {'body': json.dumps({
    #     "URL": "jungleboyspacks.com"})}

    # event2 = {'body': json.dumps({
    # "URL": "home4exotic.site"}), "queryStringParameters": {
    #     "api_key": "myverysecureapikey"
    # }}

    # print(handler(event2, {}))

    urls = ['otisi-foods.com', 'otisialiment.com', 'otisilubricants.com', 'otisipetroequip.com', 'otisipetroequip.com', 'patrickwilsonwelsh.com', 'paypal-tax.us', 'pegasus-pipeline.com', 'primecoinage.com', 'psdeliveryservice.com', 'psiloglobinmushrooms.com', 'pureafricangoldshop.com', 'purepharmamed.com', 'pyramidglobaltrustfund.com', 'quanta.africa', 'radalogistics.ru', 'reflexexpresscouriersltd.com', 'regiongruzservis.ru', 'rictecoilgas.com', 'robertanderson.info', 'rowestbk.com', 'sanhavanesepuppies.com', 'shippersline.com', 'shopforbitcoinminers.com', 'sifaxexpress.com', 'silvertonb.com', 'smartsphykittens.com', 'speedflightlogistics.com', 'splendorcourier.com', 'stancbcun.com', 'standardlifeinvestmentlimited.com', 'standardtnb.com', 'sterlingstanardllc.com', 'suarezvargas.com', 'summerlinjewel.com', 'summitstatetrust.com', 'sunequityinventories.com', 'sunocopartners-mtlp.com', 'suredeliveryexpress.com', 'swiftalliedservices.com', 'swiftcargoexpresslogistics.com', 'swiftexpress.net', 'swiftglobalexpress.com', 'swiftshippers.org', 'syncconnectchecker.com', 'synchprotocols.com', 'tabrisfbk.com', 'talkativeexoticparrots.com', 'tankyardllc.com', 'terramoollars.com', 'tescoexplogistics.com', 'tg-terminal.ru', 'thestore172021.com', 'thomasbeck.net', 'thrillionairethugsmint.com', 'tianqibond-ae.com', 'titanofinance.com', 'torrancelogistic.com', 'transportes-guzman.com', 'treasurehouseus.com', 'tzk-krylatsky.ru', 'ubserviceintl.com', 'udeliveryservice.com', 'ukdriverslicence.org', 'unicefemploy.com', 'unitechdeliveryservice.com', 'unitedtbonline.com', 'unitedtrustoff.xyz', 'usmildefense.com', 'v-cib.us', 'validatesyncwalletorg.com', 'verifiedglobaltravels.com', 'verifynftwallet.com', 'virtuosologistic.com', 'waste2ship.org', 'waynegoettschllc.com', 'wellspringstrust.us', 'wellspringstrust.us', 'wesbsterint.com', 'westatlantica.com', 'westernuniontransferr.com', 'winxdipexpress.info', 'worldgloballogisticsdelivery.com', 'wsfsbnkonline.com', 'zenapharmacy.com', 'zenoxcryptofxtrading.com', 'ziontrust.online', '420lifespanhealthdispensary.com', 'abriccapital.com', 'accessdairy.com', 'acclogisticsbv.com', 'adgecoae.com', 'adoptionpaths.com', 'afotimber.com', 'afotimber.com', 'afritimsu.com', 'agbnkchina.com', 'ajkinternational.org', 'alasrartravels.com', 'alkhalimcapitalventures.com', 'alnoortravelsae.com', 'alphachemindltd.com', 'alshaabcapital.com', 'alzafeergroupofengineering.com', 'ammoreloadingstore.com', 'antiquitiesartcollector.com', 'armsamerican.com', 'aseelsfinanceae.com', 'atlantiscoastliners.com', 'autoscuolaandreadoria.com', 'autoxpedia.com', 'avbusinessinternational.com', 'avtsbkns.com', 'bar-clayinvestmentbk.com', 'begnimbe.com', 'betavetstore.com', 'biomaraktiebolag.com', 'boafricabenin.net', 'boafricabenin.net', 'buyglockonline.com', 'buypackwoodsonline.com', 'cameroontimberexport.com', 'camteec.com', 'camtimber.com', 'camwooders.com', 'canajobs.com', 'cannabisbulksupplies.com', 'carsandengines.com', 'cumpribnk.online', 'cutebernesepuppies.com', 'cutefrenchie.com', 'cutetoypoodlesonline.com', 'dallasfruits.com', 'dcimportss.com', 'deepsouthtexterminals.com', 'delightfulshihtzupuppies.com', 'dependabledocuments.com', 'diamondmedicalweed.com', 'diamondmedicalweed.com', 'driffdtradingco.com', 'dropexpresslogistics.com', 'drugeretplug.com', 'durgstoresonline.net', 'earthglamourpets.com', 'easydeliveryco.com', 'efexcourierug.com', 'eliteprotrade.org', 'enquiresunitednations.org', 'erpdepartment.com', 'exoticsstrains.com', 'expressschnauzer.com', 'expresssecuritycargo.com', 'fedreservebk.com', 'firstcoastoffshoreservices.com', 'firstcoastoffshoreservices.com', 'flywest-cargo.com', 'getregistereddocuments.com', 'globalmoveslogistics.com', 'globalpetstransport.com', 'globalshiplogistics.com', 'globaltradingcompanyltd.com', 'glockcorporation.com', 'gocontainerltd.com', 'gokartgolfcartparts.com', 'goldendoodlespot.com', 'graphicsminiers.com', 'greenbudsdispensary.com', 'groupocarklarglobaltradingltd.com', 'gssbalticlogistics.com', 'gunprime.store', 'gunsincshop.com', 'hallmarkoilgasltd.com', 'hallucinogenicworld.com', 'hamzaroyaltravelandtours.com', 'hedgelogisticservice.com', 'illuminatidei.com', 'illuminatirecruit.com', 'inkweststorages.com', 'jkinterfoods.com', 'kendagolimited.com', 'legalcardsonly.com', 'liberalshippinglog.com', 'livemarketexchange.com', 'luckygunner.store', 'mabelconstructions.co.uk', 'maersk-spedition.com', 'magicmushroomsstore.com', 'majestytransportation.com', 'maltesefornewhomes.com', 'mascutbank.com', 'medicalmarijuanaweedshop.com', 'medikamente-rezeptfrei.pro', 'mertradingbv.com', 'metroelectronicfactory.com', 'metrofinance.trade', 'minicamagro.com', 'mrchoicelabs.com', 'mvpterminaling.com', 'nasoilgas.com', 'nationalglockstore.com', 'ojscnovomoskovskyazot.ru', 'okayasulendersgroup.com', 'oneshoppharmacy.com', 'onpointdeliveryllc.com', 'phantomcapitals.com', 'phoenixhospitalae.com', 'pinballsowners.com', 'piyaratmottors.com', 'potentialdeliveryservices.com', 'premiumseacucumber.com', 'privatecouriercompany.com', 'psychedelicsfield.com', 'psychedelicsocietyshop.com', 'psychedelicstimes.com', 'realdocuments.org', 'regionterminal.ru', 'remaxlogistics.info', 'riyadhhalalchicken.com', 'royalmaltesebreeder.com', 'royalmushroomstore.com', 'safelandtravelsae.com', 'saintmartinhospital.com', 'samosasarl.com', 'scottdachshundpupies.com', 'scpbois.net', 'sebaciabv.com', 'shippingservicesolution.com', 'shipsdirectly.com', 'smothexpressdelivery.com', 'snlog.nl', 'sofiteloil.com', 'solidstoragelogistics.com', 'soltrem.com', 'specepc.com', 'speeddeliverycago.com', 'speedy-cargo.com', 'spiritualhealerpaul.com', 'ssn-id-us.com', 'standardalliancelogistics.com', 'stbcsarl.com', 'stmartinhospitals.com', 'sumanimawumsltd.com', 'suppercurrency.com', 'swifftauto.com', 'tasnimtravelsandtourism.com', 'teddyboxerspuppies.com', 'thomaswalshllp.com', 'ticketexpresslogistic.com', 'tiendaremedymedical.net', 'tlcommercialtrading.com', 'tradexchange.online', 'tradingexpression.com', 'trans-atlanticdelivery.com', 'transgloba.com', 'trippypsychonautzone.com', 'trustcontainers.com', 'ultimatemushroomstore.com', 'ultimatewhiskeyshop.com', 'universalcourierdeliveryservice.com', 'universalstarglobaldevelopments.com', 'victorfinancial.online', 'virgoanlogistics.com', 'whiskyglobally.com', 'whiskyglobally.com', 'worldglobedocuments.com', 'worlwidedocuments.com', 'zafarnetoilandgasservices.com', 'zatandertrust.com', 'ziontrust.online', 'ztr-finance.com']

    for url in urls:
        print(f"Adding {url}")
        event = {'body': json.dumps({
            "URL": url}), "queryStringParameters": {
                "api_key": "myverysecureapikey"
            }}

        print(handler(event, {}))
