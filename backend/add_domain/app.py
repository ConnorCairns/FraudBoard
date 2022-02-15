import whois
import boto3
import json
from decimal import Decimal
import get_hosting_cost

TABLE = "domains"
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

        w = whois.whois(body["URL"])  # This call takes a while :(
        orig_creation_date = w.creation_date
        orig_expiration_date = w.expiration_date

        clean_data(w)

        tld = body["URL"].split(".")[-1]
        w["domain_cost"] = get_domain_cost(
            tld, orig_creation_date, orig_expiration_date)

        nameserver = w["name_servers"][0] if isinstance(
            w["name_servers"], list) else w["name_servers"]

        hosting_domain = f"https://{nameserver.split('.')[-2]}.{nameserver.split('.')[-1]}"

        w["hosting_cost"] = get_hosting_cost.handler(hosting_domain)

        dynamo = boto3.resource("dynamodb").Table(TABLE)
        try:
            dynamo.put_item(
                Item=w, ConditionExpression="attribute_not_exists(domain_name)")
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
    event = {'body': json.dumps({
        "URL": "prestigeglobalchem.com"})}

    print(handler(event, {}))
