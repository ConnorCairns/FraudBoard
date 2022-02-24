import re
from bs4 import BeautifulSoup as bs4
import requests
from decimal import Decimal
import dns
import dns.resolver
import socket
import whois


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


def get_hosting_cost(soup):
    # Get all possible numbers that may or may not have $ and . etc
    possible_nums = soup.find_all(
        string=re.compile('^\s*\$?£?\d+\.?\d*\s*$'))

    # Strip whitespace
    possible_nums_clean = [item.strip() for item in possible_nums]
    if len(possible_nums_clean) == 0:
        return 0  # No numbers found
        # TODO: pull from average in DB
        # TODO: store vals in diff db

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

    return Decimal(possible_nums_clean[0].split('$')[-1])


def get_cost_provider_mx(url):
    # pythondns needs domain not url, need to strip www etc
    split = f"{url.split('www')[-1]}"
    domain = split[1:] if split[0] == '.' else split

    mx_domain = dns.resolver.resolve(domain, 'MX')[0]

    # get ip from mx domain
    ip = socket.gethostbyname(str(mx_domain.exchange)[:-1])
    w = whois.whois(ip)

    if w['domain_name']:
        soup = get_soup(w['domain_name'][0])
        return get_hosting_cost(soup)

    return 0

# Lots of websites are using namecheap, initial name server may not be namecheap/hosting though


def check_namecheap_redirect(soup):
    namecheap_regex = re.compile('^(?i:.*namecheap.*)$')
    # Want to look for the redirect link
    for a in soup.find_all('a', href=True):
        if namecheap_regex.match(a['href']) is not None:
            soup = get_soup("https://www.namecheap.com/hosting/")
            if soup != 0:
                return get_hosting_cost(soup)

    return 0


def get_soup(url):
    # Try request page and give it to bs4
    try:
        page = requests.get(url, headers=headers)
        if page.status_code == 200:
            return bs4(page.content, 'lxml', multi_valued_attributes=None)
        raise ValueError("Page did not respond with 200")
    # If page errors return 0, can't estimate cost
    except Exception as e:
        print(e)
        return 0


def handler(nameserver, url):
    soup = get_soup(nameserver)

    if soup != 0:

        # Try get hosting cost easily
        cost = get_hosting_cost(soup)

        # If hosting cost was not found, most likely behind cloudflare so try other methods
        if cost == 0:
            cost = check_namecheap_redirect(soup)

            # If not namecheap move onto mx records
            if cost == 0:
                cost = get_cost_provider_mx(url)

                # Last check for namecheap again with new url
                if cost == 0:
                    cost = check_namecheap_redirect(soup)

        return cost

    return 0


if __name__ == '__main__':
    # handler("https://www.hostblast.net/")
    handler("https://cloudflare.com", "faithstandardpharmacy.com")
    # handler("https://www.interserver.net/")
    # print(handler("https://CLOUDFLARE.COM"))
