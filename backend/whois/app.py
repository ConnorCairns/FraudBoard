import whois
import json

def lambda_handler(event, context):
    URL = event['queryStringParameters']['url']
    w = whois.whois(URL)

    dump = json.dumps(w, sort_keys=True, default=str)

    res = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": dump
    }


    return res