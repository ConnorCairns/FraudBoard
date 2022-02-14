from bs4 import BeautifulSoup as bs4
import requests
import re

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
}

STEPS = 4


def handler(event, context):
    url = event['queryStringParameters']['url']
    page = requests.get(url, headers=headers)

    if page.status_code == 200:
        soup = bs4(page.content, 'lxml', multi_valued_attributes=None)

        # test = soup.find_all(
        #     class_="pricing-amount")

        # for item in test:
        #     print(item.text)

        possible_nums = soup.find_all(
            string=re.compile('^\s*\$?£?\d+\.?\d*\s*$'))

        possible_nums_clean = [item.strip() for item in possible_nums]
        print(possible_nums_clean)

        nums_distance = {}

        price_regex = re.compile('^.*price.*$')
        month_regex = re.compile('^.*month.*$')

        for idx, num in enumerate(possible_nums):
            dist_to_price = -1
            dist_to_month = -1

            curr_tag = num.parent
            for i in range(STEPS):
                if dist_to_price > -1 and dist_to_month > -1:
                    break  # Break early if found both

                # Can fail if curr_tag is a string not a tag
                # In which case just continue to next
                try:
                    curr_class = curr_tag['class']

                    price_res = price_regex.match(curr_class)
                    month_res = month_regex.match(curr_class)

                    # If price was found in class and this is first or closest price
                    if price_res != None and (dist_to_price == -1 or i < dist_to_price):
                        dist_to_price = i

                    if month_res != None and (dist_to_month == -1 or i < dist_to_month):
                        dist_to_month = i

                except Exception as e:
                    continue

                try:
                    curr_tag = curr_tag.next_sibling
                except Exception as e:
                    break

            nums_distance[possible_nums_clean[idx]] = {
                'price': dist_to_price, 'month': dist_to_month}

        print(nums_distance)


if __name__ == '__main__':
    # handler({"queryStringParameters": {"url": "https://www.hostblast.net/"}}, {})
    handler({"queryStringParameters": {
            "url": "https://www.namecheap.com/hosting/"}}, {})
    # handler({"queryStringParameters": {"url": "https://www.interserver.net/"}}, {})
