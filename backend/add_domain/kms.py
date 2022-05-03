import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import get_ad_cost

TABLE = "domains"
COST_TABLE = "category_costs"

if __name__ == "__main__":
    dynamo = boto3.resource("dynamodb").Table(TABLE)
    cost_dynamo = boto3.resource("dynamodb").Table(COST_TABLE)

    # av_costs = []
    # extra_costs = []

    all_domains = dynamo.scan(Limit=500, AttributesToGet=['domain_name', 'advertising_spend', 'total_spent', 'category'], Select="SPECIFIC_ATTRIBUTES")

    more_domains = dynamo.scan(Limit=500, ExclusiveStartKey=all_domains['LastEvaluatedKey'], AttributesToGet=['domain_name', 'advertising_spend', 'total_spent', 'category'], Select="SPECIFIC_ATTRIBUTES")

    combined_domains = all_domains['Items'] + more_domains['Items']
    # combined_domains = all_domains['Items']
    print(len(combined_domains))
    print(combined_domains[0])
    # print(combined_domains[:3])
    # print(combined_domains[0])

    # res = dynamo.get_item(Key={'domain_name': 'getyourpuppies.com'}, AttributesToGet=['domain_name', 'advertising_spend', 'total_spent'])
    # print(res['Item'])

    # combined_domains = [res['Item']]

    # print(f"got {len(combined_domains)} domains")

    # print(get_ad_cost.handler('joyfulchukchas.com'))

    # response = cost_dynamo.query(KeyConditionExpression=Key(
    #         "category").eq("all"), Limit=1, ScanIndexForward=False)

    cats = {}
    total_spend = 0

    for domain in combined_domains:
        # print(domain)
        total_spend += float(domain['total_spent'])

        if domain['category'] in cats:
            cats[domain['category']]['total_spent'] += float(domain['total_spent'])
            cats[domain['category']]['count'] += 1
        else:
            cats[domain['category']] = {'total_spent': float(domain['total_spent']), 'count': 1}

        # print(cats)


    print(total_spend)
    print(cats)

    # for domain in combined_domains:
    #     if domain['advertising_spend'] == 0:
    #         ad_cost = get_ad_cost.handler(domain['domain_name'])

    #         if ad_cost != 0:
    #             print(f"Updating ad cost for {domain['domain_name']} with val {ad_cost}")

    #             extra_costs.append(ad_cost)

    #             # print(round(Decimal(ad_cost), 2))
    #             # print(round(Decimal(float(domain['total_spent']) + ad_cost), 2))

    #             dynamo.update_item(Key={'domain_name': domain['domain_name']}, UpdateExpression="set advertising_spend = :v1, total_spent = :v2", ExpressionAttributeValues={':v1': round(Decimal(ad_cost), 2), ':v2': round(Decimal(float(domain['total_spent']) + ad_cost), 2)})

    #         av_costs.append(float(domain['total_spent']) + ad_cost)
    #     else:
    #         av_costs.append(float(domain['total_spent']))

    #     print(f"done {domain['domain_name']}")

    # print(sum(av_costs))
    # print(sum(extra_costs))