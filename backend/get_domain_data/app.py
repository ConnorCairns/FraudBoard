from decimal import Decimal
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import json

TABLE = "domains"
COST_TABLE = "category_costs"


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
    cost_dynamo = boto3.resource("dynamodb").Table(COST_TABLE)

    domain = event['queryStringParameters']['domain']

    try:
        # Get domain data
        # domain_response = dynamo.get_item(TableName=TABLE, Key={"domain_name": {"S": domain}})
        domain_response = dynamo.query(KeyConditionExpression=Key("domain_name").eq(domain), Limit=1)
        category = domain_response['Items'][0]['category']

        # Get cost data
        response = cost_dynamo.query(KeyConditionExpression=Key("category").eq(category), Limit=5, ScanIndexForward=False)

        # Get overall cost data
        overall_res = cost_dynamo.query(KeyConditionExpression=Key("category").eq("all"), Limit=5, ScanIndexForward=False)

        combined_obj = {'domain_data': domain_response['Items'][0], 'category_data': response['Items'], 'overall_data': overall_res['Items']}

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
