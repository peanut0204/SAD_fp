from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
import psycopg2
from datetime import datetime
import random
import string
import base64  # for img

# Connect to PostgreSQL and fetch data
with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()

dbname = 'GO'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# CORS(app, resources={r"/api/*": {"origins": "*"}})

# 1. search by good
@app.route('/api/searchGood', methods=['POST'])
def search_good():
    data = request.get_json()
    searchTerm = data.get('searchGood')  # the search input

    # print("searchGood")
    # connect to db
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    query = """
            select gd.goods_id, gd.goods_picture, gd.goods_name, gp.group_name, gp.group_location from goods as gd
            join go_activity as ga on ga.goods_id = gd.goods_id
            join groups as gp on gp.group_id = ga.group_id
            where gd.goods_name like %s
            """
    cursor.execute(query, ('%' + searchTerm + '%',))

    query_result = cursor.fetchall()  # result from db
    # print("searchGood")
    # connect to db
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    query = """
            select gd.goods_id, gd.goods_picture, gd.goods_name, gp.group_name, gp.group_location from goods as gd
            join go_activity as ga on ga.goods_id = gd.goods_id
            join groups as gp on gp.group_id = ga.group_id
            where gd.goods_name like %s
            """
    cursor.execute(query, ('%' + searchTerm + '%',))

    query_result = cursor.fetchall()  # result from db
    result = [
        {
            "id": row[0],
            "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
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

    # print("searchGroup")
    # connect to db
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    query = """
            SELECT g.group_id, g.group_picture, g.group_name, g.group_location, 
                COUNT(DISTINCT bp.buyer_id) + COUNT(DISTINCT sp.seller_id) AS cntMember
            FROM groups AS g
            LEFT JOIN buyer_participation AS bp ON bp.group_id = g.group_id
            LEFT JOIN seller_participation AS sp ON sp.group_id = g.group_id
            WHERE g.group_location LIKE %s
            GROUP BY g.group_id
            """
    cursor.execute(query, ('%' + searchTerm + '%',))

    query_result = cursor.fetchall()  # result from db
    # print("searchGroup")
    # connect to db
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    query = """
            SELECT g.group_id, g.group_picture, g.group_name, g.group_location, 
                COUNT(DISTINCT bp.buyer_id) + COUNT(DISTINCT sp.seller_id) AS cntMember
            FROM groups AS g
            LEFT JOIN buyer_participation AS bp ON bp.group_id = g.group_id
            LEFT JOIN seller_participation AS sp ON sp.group_id = g.group_id
            WHERE g.group_location LIKE %s
            GROUP BY g.group_id
            """
    cursor.execute(query, ('%' + searchTerm + '%',))

    query_result = cursor.fetchall()  # result from db
    result = [
        {
            "id": row[0],
            "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            "title": row[2],
            "address": row[3],
            "memberAmount": row[4]
        }
        for row in query_result
    ]

    return jsonify(result)

# 3. get all ads #######ok
@app.route('/api/getAllAds', methods=['GET'])
def get_all_ads():

    print("good_connect")
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    query = """
                Select ad_id, ad_picture from ad;
		    """
    cursor.execute(query)

    query_result = cursor.fetchall() # result from db

    result=[]
    
    for row in query_result:
        ad_id = row[0]
        ad_image_binary = row[1]

    if ad_image_binary is not None:
        # chagne to base 64
        image_base64 = base64.b64encode(ad_image_binary).decode()
    else:
        image_base64 = None

    result.append({
        "id": ad_id,
        "image": image_base64
    })

    return jsonify(result)

# 4. join group
@app.route('/api/joinGroup', methods=['POST'])
def join_group():
    data = request.get_json()
 
    groupId = data.get('groupId')
    memberId = data.get('memberId')

    try:
        # connect to PostgreSQL
        psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
        cursor = psql_conn.cursor()

        chek_query = """
                select * From buyer_participation
                where buyer_id = %s and group_id = %s

        """
        cursor.execute(chek_query,(memberId,groupId))
        existing_row = cursor.fetchone()

        if existing_row:
            # if already in
            return jsonify({'success': True, 'message': 'Group Already Joined'}), 200
        else:
            # then_insert
            insert_query = "INSERT INTO buyer_participation VALUES (%s, %s)"
            cursor.execute(insert_query,(memberId,groupId))
            psql_conn.commit()
    
            # return
            return jsonify({'success': True, 'message': 'Join Success'}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

    finally:
        # close connection
        if psql_conn:
            psql_conn.close()


    # or return jsonify({'success': False, 'message': 'Group Already Joined'}), 400
    return jsonify({'success': True, 'message': 'Join Success'}), 200


# 5. get all groups that user joined (MyGroup.jsx) Lee

app = Flask(__name__)


@app.route('/api/getJoinedGroups/<memberId>', methods=['GET'])
@cross_origin()
def get_joined_groups(memberId):
    print(memberId)
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

            cursor.execute(query, (memberId,))
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





# Oliver
# seller search group by keywords
@app.route('/api/sellerSearchGroup', methods=['POST'])
def search_groups():
    data = request.get_json()
    searchTerm = data.get('searchKeyword')  # the search input

    
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

def fetch_orders(keyword):

    if keyword is None:
        return []  # 如果為空，直接返回空列表或其他適當的值
    
    conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    
    cur = conn.cursor()
    # 執行 SQL 查詢
    cur.execute(
        """
        SELECT *
        FROM groups
        WHERE group_name ILIKE %s;
        """,
        ('%' + keyword + '%',)
    )

    # 取得查詢結果
    query_result = cur.fetchall()

    # 關閉資料庫連接
    cur.close()
    conn.close()
    return query_result

# seller search group to see orders' current state
@app.route('/api/myOrder', methods=['POST'])
def search_groups_myOrder():
    data = request.get_json()
    searchTerm = data.get('searchKeyword')  # the search input

     # 從資料庫中取得訂單資訊
    query_result = fetch_orders(searchTerm)

    # 格式化查詢結果
    result = [
        {
            # 訂單id、訂購社群、image、數量、單價、總價
            "group_name": row[0]
        }
        for row in query_result
    ]

    return jsonify(result)

@app.route('/api/orderState', methods=['POST'])
@cross_origin()
def search_groups_orderState():
    if request.method == 'POST':
        # 從表單中獲取搜索關鍵字
        keyword = request.form.get('searchTerm')

        # 從資料庫中取得訂單資訊
        query_result = fetch_orders(keyword)

        # 格式化查詢結果
        result = [
            {
                # 應要有訂單id、訂購社群、image、數量、單價、總價
                "group_id": row[0],
                "group_name": row[1],
                "group_location": row[2],
                "group_picture": row[3]
            }
            for row in query_result
        ]
        print(result)

        # 返回一個示例響應
        return jsonify(result)

# @app.route('/api/orderState', methods=['POST'])
# def search_groups_orderState():
#     data = request.get_json()
#     searchTerm = data.get('searchKeyword')  # the search input

#      # 從資料庫中取得訂單資訊
#     query_result = fetch_orders(searchTerm)

#     # 格式化查詢結果
#     result = [
#         {
#             # 應要有訂單id、訂購社群、image、數量、單價、總價
#             "group_name": row[0]
#         }
#         for row in query_result
#     ]
#     print(result)
    
#     return jsonify(result)


# seller add product
# @app.route('/api/sellerSearchGroup', methods=['GET'])

if __name__ == '__main__':
    app.run(debug=True)