import requests
import os
import scrape_text

API_KEY = os.environ.get("HUGGINGFACE")

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"
headers = {"Authorization": f"Bearer {API_KEY}"}


def handler(tokens):
    payload = {
        "inputs": ' '.join(tokens),
        "parameters": {"candidate_labels": ['pets', 'drugs', 'automotive', 'pharmacy']}
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    data = response.json()

    return(data['labels'][0])


if __name__ == '__main__':
    print(handler(scrape_text.handler("https://vland-official.com")))
