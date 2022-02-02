import boto3
import json

def lambda_handler(event, context):
    tld = event['queryStringParameters']['tld']

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