# 1. 🚀 Backend Setup Instructions

1. **Install Docker**

   - Download and install Docker Desktop from the official website: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

2. **Start the application**
    - Run Docker Desktop 
    - Navigate to the backend folder
    - Run the following command in the terminal

   ```bash
   docker-compose up --build
<br>
<br>

# 2. 🤔 Assumptions

1. The messages stored in the database are either **received** or **sent by** the same user. Therefore, only **one** ```contact_id``` needs to be stored in the ```MESSAGES``` table, representing the user associated with the message.


2. Each ```phone_number``` is unique.

<br>
<br>

# 3. 🧠✨ Key Design Decisions

## Database Initialization
### Cleaning data
- ``db/clean_data.py`` is a Python script that cleans the data from the message_content.csv file into a format that is consistent and can be easily inserted into the database.
- Double Quotes ("") are removed and some rows have single spaces which are also removed.

### Initialization of data
- As the performance of the query needs to be measured, the data have to be initialized in a deterministic way.
- Data initialization scripts are located in ``db/init-db`` folder

## Database Performance Optimization
In order to optimize the performance of the query, we need to study the query patterns and identify the areas that can be optimized.
### Query Patterns
- The queries required to fulfill are:
    - Get the 50 most recent conversations with pagination
    - Filtering by contact name, phone number and message content
### Indexing
#### Indexing for getting the 50 most recent conversations with pagination
- For the first query, we need to index the ``created_at`` column as it is used in the ``ORDER BY`` clause.
- Indexing the ``created_at`` column will help to optimize the query as it will reduce the number of rows that need to be scanned for the query
- Indexes help to prevent any full table scans and can help to reduce the number of rows that need to be scanned for the query.
- As we need the results to be sorted, we index the ``created_at`` so that the results are already sorted in descending order by the index and no additional computation is needed to sort the results.

### Performance Optimization Results
- As the dataset is generatated in a deterministic way, we can test the performance of the query by using the ``EXPLAIN ANALYZE`` command in PostgreSQL

|   INDEX?    | COST |
| ------------- | ----------------- |
| WITHOUT INDEX |         18582.58 |
| WITH INDEX    |         27149.22 |

Based on the results, we can see that indexing the ``created_at`` column will help to optimize the query as it will reduce cost required for the query
