import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import json
from decimal import Decimal

TABLE = "category_costs"

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
    dynamo = boto3.resource("dynamodb").Table(TABLE)

    key = event['queryStringParameters']['category']


    try:
        response = dynamo.query(KeyConditionExpression=Key("category").eq(key), Limit=1, ScanIndexForward=False)
    except ClientError as e:
         print(e.response['Error']['Message'])
         return res(500, 'Something went wrong')
    except Exception as e:
        print(e)
        return res(500, 'Something went wrong')
    else:
        return res(200, json.dumps(response['Items'], cls=DecimalEncoder))

if __name__ == '__main__':
    print(handler({"queryStringParameters": {
          "category": "pets"}}, {}))
