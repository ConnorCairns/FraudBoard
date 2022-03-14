import boto3
import tempfile
import scrape_text
from joblib import load
from sklearn.feature_extraction.text import TfidfVectorizer

BUCKET = "fraud-dashboard-bucket"
MODEL = "brc-clustering.joblib"


def get_classifier():
    s3 = boto3.client('s3')

    with tempfile.TemporaryFile() as data:
        s3.download_fileobj(BUCKET, MODEL, data)
        data.seek(0)
        return load(data)


def identity(token):
    return token


def handler(tokens):
    classifier = get_classifier()

    tfidf = TfidfVectorizer(max_df=0.8, min_df=1, stop_words='english', use_idf=True,
                            tokenizer=identity, preprocessor=identity, token_pattern=None)

    pred = classifier.predict(tfidf.fit_transform(tokens))

    print(pred)

    return 0


if __name__ == '__main__':
    handler(scrape_text.handler("https://vland-official.com"))
