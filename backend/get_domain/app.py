import boto3
from botocore.exceptions import ClientError
import json

TABLE = "domains"


def res(status, response): return {
    "statusCode": status,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
    "body": response
}


def handler(event, context):
    dynamo = boto3.client("dynamodb")

    key = event['queryStringParameters']['key']

    try:
        response = dynamo.get_item(TableName=TABLE, Key={"domain_name": {"S": key}})
    except ClientError as e:
         print(e.response['Error']['Message'])
         return res(500, 'Something went wrong')
    else:
        return res(200, json.dumps(response['Item']))

if __name__ == '__main__':
    print(handler({"queryStringParameters": {
          "key": "vland-official.com"}}, {}))
