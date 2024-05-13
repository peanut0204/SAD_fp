from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import psycopg2
from datetime import datetime
import random
import string


# Connect to PostgreSQL and fetch data
# with open('db_password.txt', 'r') as file:
#     db_password = file.read().strip()
db_password = 'gian6666$'
dbname = 'GO'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}})


# 1. search by good


@app.route('/api/searchGood', methods=['POST'])
def search_good():
    data = request.get_json()
    searchTerm = data.get('searchGood')  # the search input

    query_result = []  # result from db
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

    query_result = []  # result from db
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

    query_result = [[]]  # result from db
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

# 5. get all groups that user joined (MyGroup.jsx) Lee


app = Flask(__name__)


@app.route('/api/getJoinedGroups/<buyer_id>', methods=['GET'])
def get_joined_groups(buyer_id):
    print(buyer_id)
    try:
        # connect to database
        try:
            psql_conn = psycopg2.connect(
                f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
            cursor = psql_conn.cursor()

            query = '''SELECT
                        g.group_id,
                        g.group_name,
                        g.group_location,
                        g.group_picture
                    FROM
                        groups g
                    JOIN
                        buyer_participation bp ON g.group_id = bp.group_id
                    WHERE
                        bp.buyer_id = %s; '''

            cursor.execute(query, (buyer_id,))
            query_result = cursor.fetchall()

            result = [
                {
                    "group_id": row[0],
                    "group_name": row[1],
                    "group_location": row[2],
                    "group_picture": row[3],
                }
                for row in query_result
            ]
            cursor.close()
            psql_conn.close()
            print(jsonify(result), type(jsonify(result)))

        except Exception as e:
            print("Database error:", e)
            return jsonify({'error': 'Database error'}), 500

        return jsonify(result)

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500


if __name__ == '__main__':
    app.run(debug=True)
