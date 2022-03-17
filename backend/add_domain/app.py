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

        tld = body["URL"].split(".")[-1]
        w["domain_cost"] = get_domain_cost(
            tld, orig_creation_date, orig_expiration_date)

        nameserver = w["name_servers"][0] if isinstance(
            w["name_servers"], list) else w["name_servers"]

        nameserver = f"http://{nameserver.split('.')[-2]}.{nameserver.split('.')[-1]}"

        w["hosting_cost"] = Decimal(
            get_hosting_cost.handler(nameserver, body["URL"]))

        w["advertising_spend"] = Decimal(get_ad_cost.handler(body["URL"]))

        total_spent = w["domain_cost"] + \
            w["hosting_cost"] + w["advertising_spend"]
        w["total_spent"] = Decimal(total_spent)

        w["tokens"] = scrape_text.handler(f"https://{body['URL']}")

        w["category"] = bart_mnli.handler(w["tokens"])

        dynamo = boto3.resource("dynamodb").Table(TABLE)
        dynamo_cost = boto3.resource("dynamodb").Table(COSTS_TABLE)

        response = dynamo_cost.query(KeyConditionExpression=Key(
            "category").eq(w["category"]), Limit=1, ScanIndexForward=False)

        cost = 0 if len(response['Items']) == 0 else response['Items'][0]['average_cost']

        count = 1 if len(response['Items']) == 0 else response['Items'][0]['count'] + 1

        new_cost = Decimal(cost + ((total_spent - cost) / count))

        cost_item = {"category": w["category"], "timeDate": int(
            time.time()), "average_cost": new_cost, "count": count}

        try:
            dynamo.put_item(
                Item=w, ConditionExpression="attribute_not_exists(domain_name)")

            dynamo_cost.put_item(
                Item=cost_item
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

    event2 = {'body': json.dumps({
        "URL": "vland-official.com"})}

    print(handler(event2, {}))

    # urls = ["CJKETAMINESTORE.NET", "purechempharma.com", "tomh.uk", "FAITHSTANDARDPHARMACY.COM",
    #         "megaketaminestore.com", "ketamineforsale.com", "MORRISAPOTEK.COM"]
    # for url in urls:
    #     event = {'body': json.dumps({
    #         "URL": url})}

    #     print(handler(event, {}))
