FROM public.ecr.aws/lambda/python:3.8

# Install the function's dependencies using file requirements.txt
# from your project folder.
COPY requirements.txt  .
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"
RUN pip3 install nltk
# RUN python -c "import nltk;nltk.download('punkt')"
# RUN python -c "import nltk;nltk.download('stopwords')"
# COPY /usr/share/nltk_data ${HOME_DIR}/nltk_data
RUN python -m nltk.downloader punkt -d /var/task/nltk_data
RUN python -m nltk.downloader stopwords -d /var/task/nltk_data

# Copy function code
COPY app.py ${LAMBDA_TASK_ROOT}
COPY get_hosting_cost.py ${LAMBDA_TASK_ROOT}
COPY utils.py ${LAMBDA_TASK_ROOT}
COPY get_ad_cost.py ${LAMBDA_TASK_ROOT}
COPY scrape_text.py ${LAMBDA_TASK_ROOT}
COPY bart_mnli.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]