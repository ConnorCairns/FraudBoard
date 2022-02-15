import re
from bs4 import BeautifulSoup as bs4
import requests
from decimal import Decimal

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
}

STEPS = 4


def get_distance_to_string(regex_string, tag, get_next):
    dist_to_string = STEPS + 1
    regex = re.compile(regex_string)

    curr_tag = tag
    for i in range(STEPS):
        if dist_to_string < STEPS + 1:
            break  # Break early if found both

        try:
            # Check class for keyword
            curr_class = curr_tag['class']
            res = regex.match(curr_class)

            if res != None and (i < dist_to_string):
                dist_to_string = i

        except:
            pass  # may not be a class

        try:
            # Check text in tag for keyword
            text = curr_tag.string.strip()
            res_text = regex.match(text)

            if res_text != None and (i < dist_to_string):
                dist_to_string = i
        except:
            pass  # String may come back as empty so strip fails, if so move onto next

        try:
            curr_tag = get_next(curr_tag)
            while curr_tag.name == None:
                curr_tag = get_next(curr_tag)
        except Exception as e:
            break  # There is no next sibling so break

    return dist_to_string


def handler(url):
    page = requests.get(url, headers=headers)

    if page.status_code == 200:
        soup = bs4(page.content, 'lxml', multi_valued_attributes=None)

        # Get all possible numbers that may or may not have $ and . etc
        possible_nums = soup.find_all(
            string=re.compile('^\s*\$?£?\d+\.?\d*\s*$'))

        # Strip whitespace
        possible_nums_clean = [item.strip() for item in possible_nums]

        nums_distance = {}

        for idx, num in enumerate(possible_nums):

            distance_price_forward = get_distance_to_string(
                '^(?i:.*price.*)$', num.parent, lambda x: x.next_sibling)
            distance_price_backwards = get_distance_to_string(
                '^(?i:.*price.*)$', num.parent, lambda x: x.previous_sibling)

            distance_month_forward = get_distance_to_string(
                '^(?i:.*month.*)$', num.parent, lambda x: x.next_sibling)
            distance_month_backwards = get_distance_to_string(
                '^(?i:.*month.*)$', num.parent, lambda x: x.previous_sibling)

            nums_distance[possible_nums_clean[idx]] = {
                'price': min(distance_price_forward, distance_price_backwards),
                'month': min(distance_month_forward, distance_month_backwards)
            }

        # Sort first by combined distance to strings 'price' and 'month' then secondarily by value of num to get lowest bound
        possible_nums_clean.sort(
            key=lambda num: (nums_distance[num]['price'] + nums_distance[num]['month'], Decimal(num.split('$')[-1])))

        final_sum = nums_distance[possible_nums_clean[0]]['price'] + \
            nums_distance[possible_nums_clean[0]]['month']

        if final_sum == STEPS * 2 + 2:
            return 0
        else:
            return Decimal(possible_nums_clean[0].split('$')[-1])


if __name__ == '__main__':
    # handler("https://www.hostblast.net/")
    # handler("https://www.namecheap.com/hosting/")
    # handler("https://www.interserver.net/")
    print(handler("CLOUDFLARE.COM"))
