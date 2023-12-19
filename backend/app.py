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


def random_string(length, num):
    temp = []
    for i in range(num):
        letters = string.ascii_letters
        id = ''.join(random.choice(letters) for _ in range(length))
        temp.append(id)
    return temp


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# This is an example api of how to return data frame


@app.route('/api/generate_dataframe', methods=['POST'])
def generate_dataframe():
    # Get parameters from the JSON request data
    data = request.get_json()
    print("data: ", data)  # 可以多把資料印出來看看比較好操作
    '''
	data:  {'numbers': [1, 2, 3, 4, 5]}
	'''
    print("data['numbers']: ", data['numbers'])
    '''
	data['numbers']:  [1, 2, 3, 4, 5]
	'''
    # Process the data and create a DataFrame
    dataframe_data = {'numbers': data['numbers']}
    df = pd.DataFrame(dataframe_data)
    print(df)
    # Convert DataFrame to JSON and return
    return df.to_json(orient='records')

# Login


@app.route('/api/login', methods=['POST'])
def login():

    # Get parameters from the JSON request data
    data = request.get_json()

    # Extract account and password from the request data
    account = data.get('account')
    password = data.get('password')

    # Validate if account and password are present in the request
    if not account or not password:
        return jsonify({'success': False, 'message': 'Account and password are required'}), 400

    # Fetch data from the database using a prepared statement to prevent SQL injection
    try:
        psql_conn = psycopg2.connect(
            "dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password)
        query = "SELECT m.member_id, r.role, m.status FROM member AS m JOIN member_role AS r ON m.member_id=r.member_id WHERE m.account='" + \
            account+"' AND m.password='"+password+"'"
        df = pd.read_sql_query(query, psql_conn)
        psql_conn.close()
        # with psql_conn.cursor() as cursor:
        # 	cursor.execute("SELECT member_id, status FROM member AS m JOIN member_role AS r ON m.member_id=r.member_id WHERE m.account=%s AND m.password=%s", (account, password))
        # 	result = cursor.fetchone()

        if not df.empty:
            if 'Blocked' in df['status'].values:
                return jsonify({'success': False, 'message': 'Login failed. Your account has been blocked'}), 403
            else:
                if 'Admin' in df['role'].values:
                    identity = 'Admin'
                else:
                    identity = 'User'
                return jsonify({'success': True, 'memberId': df['member_id'][0], 'identity': identity})
        else:
            return jsonify({'success': False, 'message': 'Login failed. Invalid account or password'})

    except Exception as e:
        print("Error during login:", str(e))
        return jsonify({'success': False, 'message': 'An error occurred during login'}), 500


# Register
# Register
@app.route('/api/register', methods=['POST'])
def register():
    # Get parameters from the JSON request data
    data = request.get_json()

    account = data.get('account')
    password = data.get('password')
    name = data.get('name')
    nickname = data.get('nickname')
    gender = data.get('gender')
    birthday = data.get('birthday')

    # add some code here
    # connect to database
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    mid = random_string(10, 1)[0]
    insert_query = """INSERT INTO MEMBER (member_id, account, password, name, nickname, gender, birthday, status) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, 'Normal')"""

    insert_query_2 = """INSERT INTO member_role (member_id, role) VALUES (%s, 'User')"""

    cursor.execute(insert_query, (mid, account, password,
                   name, nickname, gender, birthday))
    cursor.execute(insert_query_2, (mid,))
    psql_conn.commit()
    # or return jsonify({'success': False, 'message': 'Account already registered}), 400
    # or return jsonify({'success': False, 'message': 'Invalid input fromat'}), 400
    return jsonify({'success': True, 'message': 'Register success', 'memberId': mid}), 200


# MyInfo/Favorite
@app.route('/api/favoriteBooks/<member_id>', methods=['GET'])
def get_favorite_books(member_id):
    try:
        # 連接到 PostgreSQL
        psql_conn = psycopg2.connect(
            f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
        cursor = psql_conn.cursor()

        # 執行 SQL 查詢
        query = """
			SELECT b.isbn, b.name, string_agg(a.author_name, '、') AS author_name, p.publisher_name, b.publisher_year, bt.tag_name
			FROM favorite AS f
			JOIN book AS b ON b.isbn = f.isbn
			JOIN authored_by AS ab ON ab.isbn = b.isbn
			JOIN author AS a ON a.author_id = ab.author_id
			JOIN publisher AS p ON p.publisher_id = b.publisher_id
			JOIN book_tag AS bt ON bt.isbn = b.isbn
			WHERE f.member_id = %s
			GROUP BY b.isbn, b.name, p.publisher_name, b.publisher_year, bt.tag_name;
		"""
        cursor.execute(query, (member_id,))

        # 獲取查詢結果
        query_result = cursor.fetchall()

        # 將查詢結果轉換為 JSON 格式
        result = [
            {
                "id": row[0],
                "name": row[1],
                "author": row[2],
                "publisher": row[3],
                "pub_year": row[4],
                "tag": row[5],
            }
            for row in query_result
        ]

        return jsonify(result)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

    finally:
        # 關閉連接
        if psql_conn:
            psql_conn.close()


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

    


# BookInfo/Book
@app.route('/api/bookInfo/<isbn>', methods=['GET'])
def get_bookInfo(isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = """
        SELECT b.isbn, b.name, string_agg(a.author_name, '、') AS author_name, p.publisher_name, b.publisher_year, bt.tag_name, b.Summary 
        FROM book AS b
        JOIN authored_by AS ab ON ab.isbn = b.isbn
        JOIN author AS a ON a.author_id = ab.author_id
        JOIN publisher AS p ON p.publisher_id = b.publisher_id
        JOIN book_tag AS bt ON bt.isbn = b.isbn
        WHERE b.isbn = %s
        GROUP BY b.isbn, b.name, p.publisher_name, b.publisher_year, bt.tag_name, b.summary;
    """
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (isbn, ))
        result = cursor.fetchone()
    if result:
        book_dict = {
            'isbn': result[0],
            'name': result[1],
            'author': result[2],
            'publisher': result[3],
            'pub_year': result[4],
            'tag': result[5],
            'summary': result[6],
        }
        psql_conn.close()
        return jsonify(book_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404

@app.route('/api/avg_rating/<isbn>', methods=['GET'])
def get_avg_rating(isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")

    query = """SELECT isbn, CAST(AVG(star_rating) AS FLOAT) AS avg_rating
               FROM review
               WHERE isbn = %s
               GROUP BY isbn"""
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (isbn, ))
        result = cursor.fetchone()

    if result and result[1] is not None:
        avg_rating = result[1]
        return jsonify({'avgStar': avg_rating})
    else:
        return jsonify({'avgStar': 0})

# BookInfo/Favorite
@app.route('/api/favorite/<member_id>/<isbn>', methods=['GET'])
def get_favorite(member_id, isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "SELECT * FROM favorite WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
        result = cursor.fetchone()

    psql_conn.close()
    return jsonify({'found': result is not None})


@app.route('/api/favorite/<member_id>/<isbn>', methods=['POST'])
def add_favorite(member_id, isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "INSERT INTO favorite (member_id, isbn) VALUES (%s, %s)"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Favorite added successfully'})


@app.route('/api/favorite/<member_id>/<isbn>', methods=['DELETE'])
def delete_favorite(member_id, isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "DELETE FROM favorite WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Favorite deleted successfully'})

# BookInfo/MyReview


@app.route('/api/myReview/<member_id>/<isbn>', methods=['GET'])
def get_myReview(member_id, isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "SELECT star_rating, comment, timestamp FROM review WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
        result = cursor.fetchone()
    if result:
        review_dict = {
            'star': result[0],
            'comment': result[1],
            'time': result[2].isoformat()
        }
        psql_conn.close()
        return jsonify(review_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404


@app.route('/api/myReview/<member_id>/<isbn>', methods=['POST'])
def add_review(member_id, isbn):
    data = request.get_json()

    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "INSERT INTO review (member_id, isbn, star_rating, comment, timestamp) VALUES (%s, %s, %s, %s, %s)"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn,
                       data['rating'], data['comment'], datetime.now().strftime("%Y-%m-%d")))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Review added successfully'}), 201


@app.route('/api/myReview/<member_id>/<isbn>', methods=['PUT'])
def update_review(member_id, isbn):
    data = request.get_json()

    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "UPDATE review SET star_rating = %s, comment = %s, timestamp = %s WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (data['rating'], data['comment'], datetime.now(
        ).strftime("%Y-%m-%d"), member_id, isbn))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Review updated successfully'}), 200


@app.route('/api/myReview/<member_id>/<isbn>', methods=['DELETE'])
def delete_review(member_id, isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "DELETE FROM review WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Review deleted successfully'})

# BookInfo/BookReview


@app.route('/api/bookReview/<member_id>/<isbn>', methods=['GET'])
def get_bookReview(member_id, isbn):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = """
        select r.member_id, m.nickname, star_rating, comment, timestamp from review as r
        join member as m on m.member_id = r.member_id
        where m.member_id <> %s and isbn = %s
    """
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
        result = cursor.fetchall()
    if result:
        review_dict = [
            {
                'id': row[0],
                'nickname': row[1],
                'star': row[2],
                'comment': row[3],
                'time': row[4].isoformat()
            }
            for row in result
        ]
        psql_conn.close()
        return jsonify(review_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404


# george_get_followings
@app.route('/api/followings/<member_id>', methods=['GET'])
def get_followings(member_id):
    try:
        # 建立與 PostgreSQL 資料庫的連線
        psql_conn = psycopg2.connect(
            f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
        query = "SELECT m.member_id, m.nickname FROM follow AS f JOIN member AS m ON m.member_id = f.following_mid WHERE f.member_id = %s"
        with psql_conn.cursor() as cursor:
            cursor.execute(query, (member_id,))
            results = cursor.fetchall()

        # 格式化查詢結果為 JSON
        followings_list = [{
            'id': row[0],
            'nickname': row[1]
        } for row in results]

        return jsonify(followings_list), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

    finally:
        # 關閉資料庫連線
        if psql_conn:
            psql_conn.close()

# @app.route('/api/addbook', methods=['POST'])
# def add_book():
#     try:
#         # 取得從前端送來的 JSON 資料
#         data = request.get_json()

#         # 解析 JSON 資料中的書籍資訊
#         isbn = data.get('isbn')
#         title = data.get('title')
#         author = data.get('author')
#         publisher = data.get('publisher')

#         # 在此可將收到的書籍資料做進一步處理，例如寫入資料庫或回應特定訊息給使用者
#         # 請注意：這僅是一個示範，實際上你需要將資料儲存至資料庫或適當的儲存媒介

#         # 回應使用者所送出的新增書籍資料
#         return jsonify({
#             'message': 'Book information received and processed successfully'
#         }), 201  # 201 代表資源已經被創建

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'Internal Server Error'}), 500

# @app.route('/api/addbook', methods=['POST'])
# def add_book():
#     try:
#         # 取得從前端送來的 JSON 資料
#         data = request.get_json()

#         # 解析 JSON 資料中的書籍資訊
#         isbn = data.get('isbn')
#         title = data.get('title')
#         author = data.get('author')
#         publisher = data.get('publisher')

#         # 連接到 PostgreSQL 資料庫
#         psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
#         cursor = psql_conn.cursor()

#         # 建立 SQL INSERT 指令，將資料插入到 books 表格中
#         insert_query = "INSERT INTO request_book (isbn, title, author, publisher) VALUES (%s, %s, %s, %s)"
#         cursor.execute(insert_query, (isbn, title, author, publisher))

#         # 提交執行 SQL 指令
#         psql_conn.commit()

#         # 關閉資料庫連線
#         psql_conn.close()

#         # 回應使用者新增書籍成功的訊息
#         return jsonify({'message': 'Book information added successfully'}), 201  # 201 代表資源已經被創建

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'error': 'Internal Server Error'}), 500


# MyPage/MyInfo
@app.route('/api/myInfo/<member_id>', methods=['GET'])
def get_myInfo(member_id):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = """
        select account, name, nickname, gender, birthday, role from member as m 
        join member_role as mr on mr.member_id = m.member_id where m.member_id = %s
    """
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id,))
        result = cursor.fetchone()
    if result:
        myInfo_dict = {
            'account': result[0],
            'name': result[1],
            'nickname': result[2],
            'gender': result[3],
            'birthday': result[4].isoformat(),
            'role': result[5],
        }
        psql_conn.close()
        return jsonify(myInfo_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404

# MyPage/Review


@app.route('/api/myAllReviews/<member_id>', methods=['GET'])
def get_myAllReviews(member_id):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = """
        select b.isbn, b.name, r.star_rating, r.comment, r.timestamp from review as r
        join book as b on b.isbn = r.isbn
        where r.member_id = %s
    """
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, ))
        result = cursor.fetchall()
    if result:
        review_dict = [
            {
                'id': row[0],
                'book_name': row[1],
                'star': row[2],
                'comment': row[3],
                'time': row[4].isoformat()
            }
            for row in result
        ]
        psql_conn.close()
        return jsonify(review_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404


# UserPage/UserInfo
@app.route('/api/userInfo/<other_id>', methods=['GET'])
def get_userInfo(other_id):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "select nickname from member where member_id = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (other_id,))
        result = cursor.fetchone()
    if result:
        userInfo_dict = {
            'nickname': result[0],
        }
        psql_conn.close()
        return jsonify(userInfo_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404

# UserPage/Follow


@app.route('/api/follow/<member_id>/<other_id>', methods=['GET'])
def get_follow(member_id, other_id):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "SELECT * FROM follow WHERE member_id = %s AND following_mid = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, other_id))
        result = cursor.fetchone()

    psql_conn.close()
    return jsonify({'found': result is not None})


@app.route('/api/follow/<member_id>/<other_id>', methods=['POST'])
def add_follow(member_id, other_id):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "INSERT INTO follow (member_id, following_mid) VALUES (%s, %s)"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, other_id))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Follow added successfully'})


@app.route('/api/follow/<member_id>/<other_id>', methods=['DELETE'])
def delete_follow(member_id, other_id):
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "DELETE FROM follow WHERE member_id = %s AND following_mid = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, other_id))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Follow deleted successfully'})

# where to test this api
# get member reviews

'''
@app.route('/api/reviews/<member_id>', methods=['GET'])
def reviews(member_id):

    # connect to database
    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    cursor = psql_conn.cursor()

    # run SQL query
    query = """Select b.isbn, b.Name, r.Star_Rating, r.Comment, r.timestamp From REVIEW As r
		Join MEMBER As m On m.Member_id = r.Member_id
		Join BOOK As b On b.ISBN = r.ISBN
		Where m.member_id="""+member_id+';'

    cursor.execute(query, (member_id,))

    query_result = cursor.fetchall()

    result = [
        {
            "isbn": row[0],
            "book_name": row[1],
            "star": row[2],
            "comment": row[3],
            "time": row[4]

        }
        for row in query_result
    ]

    return jsonify(result)
'''
# add record to book_request


# @app.route('/api/addbook/<member_id>', methods=['POST'])
# def add_book(member_id):
#     try:
#         # 从前端发送的请求中获取 JSON 数据
#         book_info = request.get_json()
#         print("Received book info:", book_info)  # 添加这行以检查是否正确收到了 JSON 数据

#         # 获取书籍信息中的各个字段
#         book_name = book_info.get('title')
#         author_name = book_info.get('author')
#         publisher_name = book_info.get('publisher')
#         book_isbn = book_info.get('isbn')

#         # 连接到 PostgreSQL
#         psql_conn = psycopg2.connect(
#             "dbname='" + dbname + "' user='postgres' host='localhost' password='" + db_password + "'")
#         cur = psql_conn.cursor()
#         print("Database connected successfully!")
#         sql = "INSERT INTO REQUEST_BOOK (MEMBERID, BOOK_NAME, AUTHOR_NAME, PUBLISHER_NAME, BOOK_ISBN) VALUES(%s, %s, %s, %s, %s)"
#         data = (member_id, book_name, author_name, publisher_name, book_isbn)
#         cur.execute(sql, data)
#         print("SQL executed successfully!")
#         # 提交更改
#         psql_conn.commit()

#         # 返回成功的消息给前端
#         return jsonify({"message": "Book added successfully!"}), 200

#     except Exception as e:
#         # 如果发生任何错误，回滚更改并返回错误消息给前端
#         psql_conn.rollback()
#         return jsonify({"error": str(e)}), 500
#     finally:
#         # 关闭游标和数据库连接
#         cur.close()
#         psql_conn.close()
@app.route('/api/addbook/<member_id>', methods=['POST'])
def add_book(member_id):
    try:
        # 从前端发送的请求中获取 JSON 数据
        book_info = request.get_json()
        print("Received book info:", book_info)  # 添加这行以检查是否正确收到了 JSON 数据

        # 获取书籍信息中的各个字段
        book_name = book_info.get('title')
        author_name = book_info.get('author')
        publisher_name = book_info.get('publisher')
        book_isbn = book_info.get('isbn')

        # 连接到 PostgreSQL
        psql_conn = psycopg2.connect(
            "dbname='" + dbname + "' user='postgres' host='localhost' password='" + db_password + "'")
        cur = psql_conn.cursor()
        print("Database connected successfully!")
        sql = "INSERT INTO REQUEST_BOOK (MEMBERID, BOOK_NAME, AUTHOR_NAME, PUBLISHER_NAME, BOOK_ISBN) VALUES (%s, %s, %s, %s, %s)"
        data = (member_id, book_name, author_name, publisher_name, book_isbn)
        cur.execute(sql, data)
        print("SQL executed successfully!")
        # 提交更改
        psql_conn.commit()

        # 返回成功的消息给前端
        return jsonify({"message": "Book added successfully!"}), 200
    except Exception as e:
        # 如果发生任何错误，回滚更改并返回错误消息给前端
        psql_conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # 关闭游标和数据库连接
        cur.close()
        psql_conn.close()


@app.route('/api/ShowBook', methods=["GET"])
def get_book_requests():

    psql_conn = psycopg2.connect(
        "dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password)
    # query = "select * from member_role as mr where mr.member_id = "+member_id
    # df = pd.read_sql_query(query, psql_conn)

    # if "Admin" in df['role'].values:
    cur = psql_conn.cursor()
    sql = """select br.memberid, br.book_name, br.author_name, br.publisher_name, br.book_isbn from request_book As br limit 5"""
    cur.execute(sql)
    query_result = cur.fetchall()

    result = [
        {
            "Member_id": row[0],
            "name": row[1],
            "author": row[2],
            "publisher": row[3],
            "isbn": row[4]

        }
        for row in query_result
    ]

    psql_conn.commit()
    return jsonify(result)
    # else:
    #     return jsonify({'message': 'You do not have permission to use this function'})


@app.route('/api/NewBookRequests', methods=["POST"])
def post_book_request():

    request_info = request.get_json()
    print("Received book info:", request_info)  # 添加

    isbn = request_info.get('isbn')
    title = request_info.get('title')
    author = request_info.get('author')
    publisher = request_info.get('publisher')
    year = request_info.get('publication_year')
    summ = request_info.get('summary')
    tag = request_info.get('tag')

    psql_conn = psycopg2.connect(
        "dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password)

    if 1:
        cur = psql_conn.cursor()
        query = "select p.publisher_id from publisher As p where p.publisher_name ='"+publisher+"'"
        df = pd.read_sql_query(query, psql_conn)
        print(df)
        if (df.empty):
            pid = random_string(10, 1)[0]
            print(pid, type(pid))
            cur.execute(
                "INSERT INTO PUBLISHER (publisher_id, publisher_name) VALUES (%s, %s)", (pid, publisher))
            print("publisher_id append is successful")
        else:
            pid = df['publisher_id'].values[0]
            print(pid)

        query = "select a.author_id from author As a where a.author_name ='"+author+"'"
        df = pd.read_sql_query(query, psql_conn)

        if (df.empty):
            aid = random_string(10, 1)[0]
            cur.execute(
                "INSERT INTO author (author_id, author_name) VALUES(%s, %s)", (aid, author))
            print("author_id append is successful")
        else:
            aid = df['author_id'].values[0]

        # insert book from request_book to book
        sql = "INSERT INTO BOOK(ISBN, name, publisher_year, summary, publisher_id) VALUES(%s, %s, %s, %s, %s)"
        data = (isbn, title, year, summ, pid)
        cur.execute(sql, data)

        cur.execute(
            "INSERT INTO authored_by (isbn, author_id) VALUES(%s, %s)", (isbn, aid))

        cur.execute(
            "INSERT INTO book_tag (isbn, tag_name) VALUES(%s, %s)", (isbn, tag))
        print("append book success")

        # remove book from request_book
        delete_sql = 'DELETE FROM request_book rb WHERE rb.book_isbn = %s or rb.book_name = %s'
        cur.execute(delete_sql, (isbn, title))
        print("delete from request book is success!")

        psql_conn.commit()
        return jsonify({"message": "Book added successfully!"}), 200


@app.route('/api/deleteUser/<user_id>', methods=['DELETE'])
def update_member_status(user_id):
    try:
        # 建立資料庫連線
        psql_conn = psycopg2.connect(
            f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")

        # 建立 cursor 物件
        cursor = psql_conn.cursor()

        # 執行 UPDATE 語句
        update_query = "UPDATE member SET status = 'Blocked' WHERE member.member_id ='"+user_id+"'"
        cursor.execute(update_query, (user_id,))

        # 提交交易
        psql_conn.commit()

        # 關閉 cursor 和連線
        cursor.close()
        psql_conn.close()

        print(f"User {user_id} status updated to 'Block'")
        return jsonify({"message": "delete successfully!"}), 200

    except psycopg2.Error as e:
        print("Error updating member status:", e)
        return jsonify({"message": "delete failed!"}), 200


@app.route('/api/reviews/<member_id>', methods=['GET'])
def get_review_requests(member_id):

    psql_conn = psycopg2.connect(
        "dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password)
    # query = "select * from member_role as mr where mr.member_id = "+member_id
    # df = pd.read_sql_query(query, psql_conn)
    print(member_id)
    # if "Admin" in df['role'].values:
    cur = psql_conn.cursor()
    sql = """select re.member_id, re.isbn, re.star_rating, re.comment, re.timestamp from review As re WHERE member_id = %s"""
    cur.execute(sql, (member_id,))
    query_result = cur.fetchall()

    result = [
        {
            "id": row[0],
            "isbn": row[1],
            "star": row[2],
            "comment": row[3],
            "time": row[4].isoformat()

        }
        for row in query_result
    ]

    psql_conn.commit()
    return jsonify(result)
    # else:
    #     return jsonify({'message': 'You do not have permission to use this function'})

'''
@app.route('/api/reviews', methods=['GET'])
def get_review_requests():

    psql_conn = psycopg2.connect(
        "dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password)
    # query = "select * from member_role as mr where mr.member_id = "+member_id
    # df = pd.read_sql_query(query, psql_conn)

    # if "Admin" in df['role'].values:
    cur = psql_conn.cursor()
    sql = """select re.member_id, re.isbn, re.star_rating, re.comment, re.timestamp from review As re limit 10"""
    cur.execute(sql)
    query_result = cur.fetchall()

    result = [
        {
            "id": row[0],
            "isbn": row[1],
            "star": row[2],
            "comment": row[3],
            "time": row[4].isoformat()

        }
        for row in query_result
    ]

    psql_conn.commit()
    return jsonify(result)
    # else:
    #     return jsonify({'message': 'You do not have permission to use this function'})
'''

@app.route('/api/deleteComments', methods=['DELETE'])
def deleteComments():
    reviews_to_delete = request.get_json()
    print(reviews_to_delete)  # 印出收到的要刪除的評論資料

    psql_conn = psycopg2.connect(
        f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")

    for review in reviews_to_delete:
        member_id = review.get('id')
        isbn = review.get('isbn')
        query = "DELETE FROM review WHERE member_id = %s AND isbn = %s"
        print(isbn, member_id)
        with psql_conn.cursor() as cursor:
            cursor.execute(query, (member_id, isbn,))

    psql_conn.commit()
    psql_conn.close()

    return jsonify({'message': 'reviews deleted successfully'})

# anyPage
@app.route('/api/myRole/<member_id>', methods=['GET'])
def get_myRole(member_id):
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = """
        select role from member_role where member_id = %s
    """
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id,))
        result = cursor.fetchone()
    if result:
        myInfo_dict = {
            'role': result[0],
        }
        psql_conn.close()
        return jsonify(myInfo_dict), 200
    else:
        psql_conn.close()
        return jsonify(None), 404


if __name__ == '__main__':
    app.run(debug=True)
