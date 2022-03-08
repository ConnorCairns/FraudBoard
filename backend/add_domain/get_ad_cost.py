import requests
import os

API_KEY = os.environ.get("SEOREVIEWTOOLS_API_KEY")

WEBSITE_TRAFFIC_URL = lambda url: f"https://api.seoreviewtools.com/website-traffic/?url={url}&key={API_KEY}"
WEBSITE_TRAFFIC_ORGANIC_PAID_URL = lambda url: f"https://api.seoreviewtools.com/website-traffic-organic-paid/?url={url}&location=United States&hl=English&key={API_KEY}"

#From https://www.statista.com/statistics/242549/digital-ad-market-share-of-major-ad-selling-companies-in-the-us-by-revenue/
#Google
GOOGLE_PERCENTAGE = 28.9

#Facebook
FACEBOOK_PERCENTAGE = 24.9


def handler(url):
    res = requests.get(WEBSITE_TRAFFIC_ORGANIC_PAID_URL(url))

    print(res.json())

    return 0

if __name__ == '__main__':
    handler("jungleboypacks.com")