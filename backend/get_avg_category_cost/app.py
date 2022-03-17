import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import json

TABLE = "category_costs"

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
        response['Items'][0]['average_cost'] = float(response['Items'][0]['average_cost'])
        response['Items'][0]['count'] = int(response['Items'][0]['count'])
        response['Items'][0]['timeDate'] = int(response['Items'][0]['timeDate'])
    except ClientError as e:
         print(e.response['Error']['Message'])
         return res(500, 'Something went wrong')
    except Exception as e:
        print(e)
        return res(500, 'Something went wrong')
    else:
        return res(200, json.dumps(response['Items']))

if __name__ == '__main__':
    print(handler({"queryStringParameters": {
          "category": "pets"}}, {}))
