from decimal import Decimal
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import json

TABLE = "domains"

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

    registrar = event['queryStringParameters']['registrar']

    try:
        response = dynamo.query(IndexName="registrar-total_spent-index", KeyConditionExpression=Key("registrar").eq(registrar), Limit=3, ScanIndexForward=False)
        #TODO: remove res if same as current

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
          "domain": "spanielsandfrise.com"}}, {}))
