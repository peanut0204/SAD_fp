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
@cross_origin()
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
            #"image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
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
@cross_origin()
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
@cross_origin()
def get_all_ads():

    print("good_connect")
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    query = """
                Select ad_id, ad_picture from ad;
		    """
    cursor.execute(query)

    query_result = cursor.fetchall()  # result from db

    result = []

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
@cross_origin()
def join_group():
    data = request.get_json()

    groupId = data.get('groupId')
    memberId = data.get('memberId')

    try:
        # connect to PostgreSQL
        psql_conn = psycopg2.connect(
            f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
        cursor = psql_conn.cursor()

        chek_query = """
                select * From buyer_participation
                where buyer_id = %s and group_id = %s

        """
        cursor.execute(chek_query, (memberId, groupId))
        existing_row = cursor.fetchone()

        if existing_row:
            # if already in
            return jsonify({'success': True, 'message': 'Group Already Joined'}), 200
        else:
            # then_insert
            insert_query = "INSERT INTO buyer_participation VALUES (%s, %s)"
            cursor.execute(insert_query, (memberId, groupId))
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

# app = Flask(__name__)


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

            query = '''SELECT g.group_id, g.group_picture, g.group_name, g.group_location, 
                        COUNT(DISTINCT bp.buyer_id) + COUNT(DISTINCT sp.seller_id) AS cntMember
                    FROM groups AS g
                    LEFT JOIN buyer_participation AS bp ON bp.group_id = g.group_id
                    LEFT JOIN seller_participation AS sp ON sp.group_id = g.group_id
                    WHERE bp. buyer_id  = %s
                    GROUP BY g.group_id'''

            cursor.execute(query, (memberId,))
            query_result = cursor.fetchall()

            result = [
                {
                    "group_id": row[0],
                    "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
                    "title": row[2],
                    "group_location": row[3],
                    "memberAmount": row[4]
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

# show product in specific group


@app.route('/api/getGroupProduct/<groupId>', methods=['GET'])
@cross_origin()
def get_group_product(groupId):
    print(groupId)

    # product = [
    #     {
    #         "group_id": 123456,
    #         "group_name": "Group 1",
    #         "image": 'data:image/jpeg;base64,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',
    #         "product_name": "芭樂",
    #         "product_id": 1,
    #         "price": 10,
    #         "tag": "水果",
    #         "seller_id": 1,
    #         "seller_name": "Seller 1"
    #     },
    #     {
    #         "group_id": 654321,
    #         "group_name": "Group 1",
    #         "image": '../images/cover.png',
    #         "product_name": "手機",
    #         "product_id": 2,
    #         "price": 20,
    #         "tag": "3C",
    #         "seller_id": 2,
    #         "seller_name": "Seller 2"
    #     }
    # ]
    # # r = jsonify(product)
    # # print(r.group_name)

    # return jsonify(product)
    try:
        # connect to database
        try:
            psql_conn = psycopg2.connect(
                f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
            cursor = psql_conn.cursor()

            query = '''select gp.group_id, gp.group_name,
 gd.goods_picture, gd.goods_name, gd.goods_id, gd.unite_price, gd.tag,
 gd.seller_id, s.seller_name from groups as gp
join goods as gd on gd.group_id = gp.group_id
join seller as s on s.seller_account = gd.seller_id
where gp.group_id = %s'''

            cursor.execute(query, (groupId,))
            query_result = cursor.fetchall()

            result = [
                {
                    "group_id": row[0],
                    "group_name": row[1],
                    "image": base64.b64encode(row[2]).decode('utf-8') if row[2] else None,
                    "product_name": row[3],
                    "product_id": row[4],
                    "price": row[5],
                    "tag": row[6],
                    "seller_id": row[7],
                    "seller_name": row[8]
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
# seller search group by good

@app.route('/api/sellerSearchGood', methods=['POST'])
@cross_origin()
def seller_search_good():
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
    
    result = [
        {
            "id": row[0],
            "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            # "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            "title": row[2],
            "group": row[3],
            "groupAddress": row[4]
        }
        for row in query_result
    ]

    return jsonify(result)


# seller search group by places
@app.route('/api/sellerSearchGroup', methods=['POST'])
@cross_origin()
def seller_search_groups():
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
    
    result = [
        {
            "id": row[0],
            "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            # "image": base64.b64encode(row[1]).decode('utf-8') if row[1] else None,
            "title": row[2],
            "address": row[3],
            "memberAmount": row[4]
        }
        for row in query_result
    ]

    return jsonify(result)

# function used in myOrder and orderState 
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
            "group_id": row[0],
            "group_name": row[1],
            "group_location": row[2],
            "group_picture": row[3]
        }
        for row in query_result
    ]

    return jsonify(result)


@app.route('/api/orderState', methods=['POST'])
# @cross_origin()
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


import uuid
import random
import psycopg2

# 產生不重複的 ID
def generate_unique_id(cur):
    while True:
        # Generate a random 10-digit number
        group_id = ''.join([str(random.randint(0, 9)) for _ in range(10)])
        
        # Check if this ID already exists in the database
        cur.execute("SELECT 1 FROM GROUPS WHERE GROUP_ID = %s", (group_id,))
        if not cur.fetchone():
            # If no record exists with this ID, it's unique
            return group_id

# build group
# @app.route('/api/buildGroup/<member_id>', methods=['POST'])
# def build_group(member_id):
@app.route('/api/buildGroup', methods=['POST'])
def build_group():
    try:
        # 从前端发送的请求中获取 JSON 数据
        group_info = request.get_json()
        print("Received group info:", group_info)  # 添加这行以检查是否正确收到了 JSON 数据

        # 连接到 PostgreSQL
        psql_conn = psycopg2.connect(
            "dbname='" + dbname + "' user='postgres' host='localhost' password='" + db_password + "'")
        cur = psql_conn.cursor()
        print("Database connected successfully!")

        # Generate a unique 10-digit ID
        group_id = generate_unique_id(cur)
        print("Generated unique 10-digit ID:", group_id)

        # 获取书籍信息中的各个字段
        group_name = group_info.get('name')
        group_cover = group_info.get('cover')
        group_location = group_info.get('location')
        group_member_limit = group_info.get('member_limit')
        group_rules = group_info.get('rules')

        # sql = "INSERT INTO REQUEST_GROUP (GROUP_NAME, GROUP_PICTURE, GROUP_LOCATION, GROUP_MEMBER_LIMIT , GROUP_RULES) VALUES (%s, %s, %s, %s, %s)"
        # data = (group_name, group_cover, group_location, group_member_limit, group_rules)

        # 加入自動生成的 GROUP_ID!!
        sql = "INSERT INTO GROUPS (GROUP_ID, GROUP_NAME, GROUP_LOCATION, GROUP_PICTURE) VALUES (%s, %s, %s, %s)"
        data = (group_id, group_name, group_location, group_cover)
        cur.execute(sql, data)
        print("SQL executed successfully!")
        # 提交更改
        psql_conn.commit()

        # 返回成功的消息给前端
        return jsonify({"message": "group added successfully!"}), 200
    except Exception as e:
        # 如果发生任何错误，回滚更改并返回错误消息给前端
        psql_conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # 关闭游标和数据库连接
        cur.close()
        psql_conn.close()

if __name__ == '__main__':
    app.run(debug=True)
