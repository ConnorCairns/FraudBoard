from urllib import response
import boto3

TABLE = "domains"


def add_to_tokens_list(tokens, items):
    for item in items:
        tokens[item["domain_name"]] = item["tokens"]

    return tokens


def get_tokens():
    tokens = {}

    dynamo = boto3.resource("dynamodb").Table(TABLE)

    res = dynamo.scan()
    tokens = add_to_tokens_list(tokens, res["Items"])

    while "LastEvaluatedKey" in res:
        res = dynamo.scan(ExclusiveStartKey=res["LastEvaluatedKey"])
        tokens = add_to_tokens_list(tokens, res["Items"])

    return tokens


def handler():

    tokens = get_tokens()
    print(tokens.keys())

    return 0


if __name__ == '__main__':
    handler()
