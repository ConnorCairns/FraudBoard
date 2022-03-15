import boto3
import tempfile
import scrape_text
from joblib import load

BUCKET = "fraud-dashboard-bucket"
MODEL = "brc-clustering.joblib"
TFIDF = "tfidf.joblib"

def get_file_from_s3(obj):
    s3 = boto3.client('s3')

    with tempfile.TemporaryFile() as data:
        s3.download_fileobj(BUCKET, obj, data)
        data.seek(0)
        return load(data)

def identity(token):
    return token

def handler(tokens):
    classifier = get_file_from_s3(MODEL)
    tfidf = get_file_from_s3(TFIDF)

    pred = classifier.predict(tfidf.fit_transform([tokens]))

    return pred


if __name__ == '__main__':
    print(handler(scrape_text.handler("https://vland-official.com")))
