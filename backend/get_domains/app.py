import boto3
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

    response = dynamo.scan(
        TableName=TABLE,
        Limit=10
    )

    try:
        items = response.get('Items')

        return res(200, json.dumps(items))
    except:  # should do better checks here
        return res(500, 'Something went wrong')


if __name__ == '__main__':
    handler({}, {})
