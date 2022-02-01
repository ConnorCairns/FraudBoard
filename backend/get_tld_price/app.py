import boto3
import json

def handler(event, context):
    body = json.loads(event["body"])
    tld = body["TLD"]

    route53 = boto3.client("route53domains", region_name="us-east-1")

    response = route53.list_prices(Tld=tld)
    res = json.dumps(response["Prices"][0])

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": res
    }