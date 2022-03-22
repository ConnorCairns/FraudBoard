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

TABLE = "domains"
COSTS_TABLE = "category_costs"
DATE_COLS = ["creation_date", "expiration_date", "updated_date"]
SECONDS_IN_YEAR = 31536000


def res(status, response): return {
    "statusCode": status,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    "body": response
}


def clean_data(data):
    if isinstance(data["domain_name"], list):
        data["domain_name"] = data["domain_name"][0].lower()

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
    prices = res["Prices"][0]

    if isinstance(creation_date, list):
        creation_date = creation_date[0]
    if isinstance(expiration_date, list):
        expiration_date = expiration_date[0]

    years = (expiration_date - creation_date).total_seconds() // SECONDS_IN_YEAR

    domain_cost = res["Prices"][0]["RegistrationPrice"]["Price"] * years

    return Decimal(domain_cost)


def handler(event, context):

    try:  # improve this at some point
        body = json.loads(event["body"])
        w = whois.whois(body["URL"])  # This call takes a while
        orig_creation_date = w.creation_date
        orig_expiration_date = w.expiration_date

        clean_data(w)

        # DOMAIN COST
        tld = body["URL"].split(".")[-1]
        w["domain_cost"] = get_domain_cost(
            tld, orig_creation_date, orig_expiration_date)

        # HOSTING COST
        nameserver = w["name_servers"][0] if isinstance(w["name_servers"], list) else w["name_servers"]

        nameserver = f"http://{nameserver.split('.')[-2]}.{nameserver.split('.')[-1]}"

        w["hosting_cost"] = Decimal(get_hosting_cost.handler(nameserver, body["URL"]))

        # AD COST
        w["advertising_spend"] = Decimal(get_ad_cost.handler(body["URL"]))

        # TOTAL COST
        total_spent = w["domain_cost"] + w["hosting_cost"] + w["advertising_spend"]
        w["total_spent"] = Decimal(total_spent)

        # CATEGORY
        w["tokens"] = scrape_text.handler(f"https://{body['URL']}")

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

        new_cost = Decimal(cost + ((total_spent - cost) / count))

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
    #     "URL": "Realdocsnow.com"})}

    # print(handler(event2, {}))

    # urls = ["prestigeglobalchem.com", "omaghenshihtzuhome.com", "southhilltoppuppies.com", "johnbellteacupmaltese.com", "CJKETAMINESTORE.NET", "purechempharma.com", "monarchbulldogs-sa.com", "jungleboyspacks.com", "FAITHSTANDARDPHARMACY.COM", "premiumdachshundpups.com", "K2DRUGSTORE.COM", "STRANDNORDBV.COM", "SKYPHARMACYPILS.COM",
    #         "vland-official.com", "megaketaminestore.com", "ketamineforsale.com", "shihtzupuppiesforsale-us.com", "MORRISAPOTEK.COM", "percocetpills.com", "pelluciddalmatianpuppieshome.com", "DROMEDARYVILLE.COM", "ROYALSITEYORKSHIRETERRIERPUPPIES.COM", "PUPPYSTASHKENNELAU.COM", "cutestdoodleskennel.com", "bradsmaltipoos.com"]
    urls = ["prestigeglobalchem.com", "purechempharma.com", "REALDOCSNOW.COM", "K2DRUGSTORE.COM", "strandnordbv.com", "megaketaminestore.com", "shihtzupuppiesforsale-us.com",
            "MORRISAPOTEK.COM", "percocetpills.com", "pelluciddalmatianpuppieshome.com", "DROMEDARYVILLE.COM", "ROYALSITEYORKSHIRETERRIERPUPPIES.COM", "cjketaminestore.net", "JUNGLEBOYSPACKS.COM"]
    for url in urls:
        print(f"Adding {url}")
        event = {'body': json.dumps({
            "URL": url})}

        print(handler(event, {}))
