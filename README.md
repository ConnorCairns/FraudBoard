# FraudBoard
This work presents a framework to estimate investment into fraud websites in real-time, or close to
real-time, by collating open source information, and categorising via machine learning techniques. This
investment estimation is then used as a proxy for estimating profits, with the thought process that if
investment is going in to a website, it must be profitable.

See full paper: to be added

![home page](/imgs/homepage.png)

# Getting Started

## Prerequisites
- Docker
- AWS CLI
- Node.js
- Python (3.6+)

### AWS DynammoDB 
The project assumes DynamoDB tables have already been created of the following specification:

#### Domains Table

- Name: domains
- Partition Key: domain_name (String)
- GSI
    - Name: registrar-total_spent-index
    - Partition Key: registrar (String)
    - Sort Key: total_spent (Number)
    - Projected Attributes: All

#### Category Costs Table

- Name: category_costs
- Partition Key: category (String)
- Sort Key: timeDate (Number)

### Development Setup

#### Frontend

- Navigate to frontend directory

    ```
    cd frontend
    ```

- Install dependencies and run
    ```
    npm install
    npm start
    ```

#### Backend

- Navigate to backend directory
    ```
    cd backend
    ```
- Build Lambda functions
    ```
    sam build
    ```
- Start local HTTP server to host functions on port 4000
    ```
    sam local start-api -p 4000
    ```

### Deployment

- In frontend directory `npm run build` and deploy to frontend host of choice
    - a Dockerfile and nginx config have been provided if you want to deploy containerised
- After building Lambda functions `sam deploy --guided` and follow instructions in terminal