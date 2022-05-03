import requests
import os

# API_KEY = os.environ.get("SEOREVIEWTOOLS_API_KEY")
API_KEY = "sfdkj324578y43586-43587yuhgfdj"


def WEBSITE_TRAFFIC_URL(
    url): return f"https://api.seoreviewtools.com/website-traffic/?url={url}&key={API_KEY}"


def WEBSITE_TRAFFIC_ORGANIC_PAID_URL(
    url): return f"https://api.seoreviewtools.com/website-traffic-organic-paid/?url={url}&location=United States&hl=English&key={API_KEY}"


FACEBOOK_AVG_CPC = 1.72


def handler(url):
    estimated_cost = 0

    try:
        res1 = requests.get(WEBSITE_TRAFFIC_URL(url), timeout=30)

        paid_traffic = res1.json()['data']['data'][0]['traffic']['sources']['search_ad']['value'] + res1.json()['data']['data'][0]['traffic']['sources']['display_ad']['value']

        if paid_traffic == 0:
            res = requests.get(WEBSITE_TRAFFIC_ORGANIC_PAID_URL(url), timeout=30)
            paid_traffic = res.json()['data']['data'][0]['paid']

        estimated_cost = paid_traffic * FACEBOOK_AVG_CPC

    except Exception as e:
        print(e)
        pass

    return estimated_cost


if __name__ == '__main__':
    print(handler("joyfulchukchas.com"))
