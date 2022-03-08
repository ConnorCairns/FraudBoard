import requests
import os

API_KEY = os.environ.get("SEOREVIEWTOOLS_API_KEY")


def WEBSITE_TRAFFIC_URL(
    url): return f"https://api.seoreviewtools.com/website-traffic/?url={url}&key={API_KEY}"


def WEBSITE_TRAFFIC_ORGANIC_PAID_URL(
    url): return f"https://api.seoreviewtools.com/website-traffic-organic-paid/?url={url}&location=United States&hl=English&key={API_KEY}"


FACEBOOK_AVG_CPC = 1.72


def handler(url):
    estimated_cost = 0

    try:
        res = requests.get(WEBSITE_TRAFFIC_ORGANIC_PAID_URL(url))

        paid_traffic = res.json()['data']['data'][0]['paid']
        estimated_cost = paid_traffic * FACEBOOK_AVG_CPC

    except Error as e:
        print(e)
        pass

    return estimated_cost


if __name__ == '__main__':
    print(handler("vland-official.com"))
