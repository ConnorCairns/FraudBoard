import requests
from bs4 import BeautifulSoup as bs4

ERROR = 400

headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
}


def get_soup(url):
    # Try request page and give it to bs4
    try:
        page = requests.get(url, headers=headers)
        if page.status_code == 200:
            return bs4(page.content, 'lxml', multi_valued_attributes=None)
        raise ValueError("Page did not respond with 200")
    # If page errors return 0
    except Exception as e:
        print(e)
        return ERROR
