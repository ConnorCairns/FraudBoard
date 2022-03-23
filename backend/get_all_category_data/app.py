from decimal import Decimal
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import json

COST_TABLE = "category_costs"
#TODO: put this in db and pull from there instead
CATEGORIES = ["pets", "drugs", "automotive", "pharmacy", "counterfeits"]


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return json.JSONEncoder.default(self, obj)


def res(status, response): return {
    "statusCode": status,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
    "body": response
}


def handler(event, context):
    cost_dynamo = boto3.resource("dynamodb").Table(COST_TABLE)
    combined_obj = {}

    try:
        # Get overall cost data
        overall_res = cost_dynamo.query(KeyConditionExpression=Key("category").eq("all"), Limit=5, ScanIndexForward=False)
        combined_obj['all'] = overall_res['Items']

        for category in CATEGORIES:
            response = cost_dynamo.query(KeyConditionExpression=Key("category").eq(f"{category}"), Limit=5, ScanIndexForward=False) 
            if len(response['Items']) > 0:
                combined_obj[category] = response['Items']

    except ClientError as e:
        print(e.response['Error']['Message'])
        return res(500, 'Something went wrong')
    except Exception as e:
        print(e)
        return res(500, 'Something went wrong')
    else:
        return res(200, json.dumps(combined_obj, cls=DecimalEncoder))


if __name__ == '__main__':
    print(handler({"queryStringParameters": {
          "domain": "spanielsandfrise.com"}}, {}))
