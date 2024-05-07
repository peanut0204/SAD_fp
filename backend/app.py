from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import psycopg2
from datetime import datetime
import random
import string

# Connect to PostgreSQL and fetch data
with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()
dbname = 'bula'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

#1 input query
@app.route('/api/searchbook', methods=['POST'])
def search_books():
    data = request.get_json()
    # values in seachType: all(search title+author), title, author
    searchType = data.get('searchType')
    searchTerm = data.get('searchTerm')  # the search input

    # connect to db
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    # return a jasonify dataframe with columns: isban, title, author
    if (searchType == 'all'):
        query = """select  b.Name, b.ISBN, b.SUmmary, string_agg(a.author_name, '、') AS author_name, p.Publisher_name,
        bt.Tag_name From BOOK As b 
        Join AUTHORED_BY As ab On ab.ISBN = b.ISBN
        Join AUTHOR As a On a.Author_id = ab.Author_id
        Join PUBLISHER As p On p.Publisher_id = b.Publisher_id
        Join BOOK_TAG As bt On bt.ISBN = b.ISBN
        Where b.Name Like """ + "'%" + searchTerm + "%'" + "Or a.Author_name Like" + "'%" + searchType + "%'"+"""
        GROUP BY b.isbn, b.name, p.publisher_name, b.publisher_year, bt.tag_name;"""


    if (searchType == 'title'):
        query = """select  b.Name, b.ISBN, b.SUmmary, string_agg(a.author_name, '、') AS author_name, p.Publisher_name,
        bt.Tag_name From BOOK As b 
        Join AUTHORED_BY As ab On ab.ISBN = b.ISBN
        Join AUTHOR As a On a.Author_id = ab.Author_id
        Join PUBLISHER As p On p.Publisher_id = b.Publisher_id
        Join BOOK_TAG As bt On bt.ISBN = b.ISBN
        Where b.Name Like """ + "'%" + searchTerm + "%'"+"""
        GROUP BY b.isbn, b.name, p.publisher_name, b.publisher_year, bt.tag_name;"""
    if (searchType == 'author'):
        query = """select  b.Name, b.ISBN, b.SUmmary, string_agg(a.author_name, '、') AS author_name, p.Publisher_name,
        bt.Tag_name From BOOK As b 
        Join AUTHORED_BY As ab On ab.ISBN = b.ISBN
        Join AUTHOR As a On a.Author_id = ab.Author_id
        Join PUBLISHER As p On p.Publisher_id = b.Publisher_id
        Join BOOK_TAG As bt On bt.ISBN = b.ISBN
        Where a.Author_name Like""" + "'%" + searchTerm + "%'" + """
        GROUP BY b.isbn, b.name, p.publisher_name, b.publisher_year, bt.tag_name;"""

    # search_term_pattern = '%' + searchTerm + '%'
    cursor.execute(query)

    query_result = cursor.fetchall()
    psql_conn.commit()

    result = [
        {
            "isbn": row[1],
            "title": row[0],
            "author": row[3]
        }
        for row in query_result
    ]

    return jsonify(result)