import requests
import os

API_KEY = os.environ.get("SEOREVIEWTOOLS_API_KEY")

WEBSITE_TRAFFIC_URL = lambda url: f"https://api.seoreviewtools.com/website-traffic/?url={url}&key={API_KEY}"
WEBSITE_TRAFFIC_ORGANIC_PAID_URL = lambda url: f"https://api.seoreviewtools.com/website-traffic-organic-paid/?url={url}&location=United States&hl=English&key={API_KEY}"

def handler(url):
    res = requests.get(WEBSITE_TRAFFIC_ORGANIC_PAID_URL(url))

    print(res.json())

    return 0

if __name__ == '__main__':
    handler("jungleboypacks.com")