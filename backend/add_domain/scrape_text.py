import utils
import nltk

# nltk.download('punkt')

stemmer = nltk.stem.SnowballStemmer("english")

stop_words = nltk.corpus.stopwords.words('english')

def handler(url):
    soup = utils.get_soup(url)

    if soup != utils.ERROR:
        #Split raw text into individual words
        tokens = nltk.word_tokenize(soup.get_text())
        # print(soup.get_tex)

        #Remove non alphanumeric characters, numbers, special characters etc
        tokens_alphanumeric = [token for token in tokens if token.isalpha() and not token.lower() in stop_words]
        
        #Only want the stem of the word for easier comparison, playing -> play
        stemmed_tokens = [stemmer.stem(token) for token in tokens_alphanumeric]

        return stemmed_tokens


if __name__ == '__main__':
    print(handler("https://vland-official.com"))
