import whois
import json

def lambda_handler(event, context):
    body = json.loads(event["body"])
    w = whois.whois(body["URL"])

    dump = json.dumps(w, sort_keys=True, default=str)

    res = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": dump
    }


    return res