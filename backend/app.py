from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import psycopg2
from datetime import datetime
import random
import string

# # Connect to PostgreSQL and fetch data
# with open('db_password.txt', 'r') as file:
#     db_password = file.read().strip()
# dbname = 'bula'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# 1. search by good
@app.route('/api/searchGood', methods=['POST'])
def search_good():
    data = request.get_json()
    searchTerm = data.get('searchGood')  # the search input

    
    query_result = [] # result from db
    result = [
        {
            "id": row[0],
            "image": row[1],
            "title": row[2],
            "group": row[3],
            "groupAddress": row[4]
        }
        for row in query_result
    ]

    return jsonify(result)

# 2. search group by place
@app.route('/api/searchGroup', methods=['POST'])
def search_groups():
    data = request.get_json()
    searchTerm = data.get('searchPlace')  # the search input

    
    query_result = [] # result from db
    result = [
        {
            "id": row[0],
            "image": row[1],
            "title": row[2],
            "address": row[3],
            "memberAmount": row[4]
        }
        for row in query_result
    ]

    return jsonify(result)

# 3. get all ads
@app.route('/api/getAllAds', methods=['GET'])
def get_all_ads():


    query_result = [[]] # result from db
    result = [
        {
            "id": row[0],
            "image": row[1]
            
        }
        for row in query_result
    ]

    return jsonify(result)

# 4. join group
@app.route('/api/joinGroup', methods=['POST'])
def join_group():
    data = request.get_json()
    groupId = data.get('groupId')
    memberId = data.get('userId')


    # or return jsonify({'success': False, 'message': 'Group Already Joined'}), 400
    return jsonify({'success': True, 'message': 'Join Success'}), 200

if __name__ == '__main__':
    app.run(debug=True)
