from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import psycopg2
from datetime import datetime

# Connect to PostgreSQL and fetch data
with open('db_password.txt', 'r') as file:
	db_password = file.read().strip()
dbname = 'DBMS_new'


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

#This is an example api of how to return data frame 
@app.route('/api/generate_dataframe', methods=['POST'])
def generate_dataframe():
	# Get parameters from the JSON request data
	data = request.get_json()
	print("data: ",data) #可以多把資料印出來看看比較好操作
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
		psql_conn = psycopg2.connect("dbname='"+dbname+"' user='postgres' host='localhost' password=" + db_password) 
		query = "SELECT m.member_id, r.role FROM member AS m JOIN member_role AS r ON m.member_id=r.member_id WHERE m.account='"+account+"' AND m.password='"+password+"'"
		df = pd.read_sql_query(query, psql_conn)
		psql_conn.close()
		# with psql_conn.cursor() as cursor:
		# 	cursor.execute("SELECT member_id, status FROM member AS m JOIN member_role AS r ON m.member_id=r.member_id WHERE m.account=%s AND m.password=%s", (account, password))
		# 	result = cursor.fetchone()

		if not df.empty:
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


#Register
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
	
	#add some code here
	
	# or return jsonify({'success': False, 'message': 'Account already registered}), 400
	# or return jsonify({'success': False, 'message': 'Invalid input fromat'}), 400
	return jsonify({'success': True, 'message': 'Register success', 'memberId': 1}), 200

	

@app.route('/api/favoriteBooks/<member_id>', methods=['GET'])
def get_favorite_books(member_id):
	try:
		# 連接到 PostgreSQL
		psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
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
	searchType = data.get('searchType') # values in seachType: all(search title+author), title, author 
	searchTerm = data.get('searchTerm') #the search input
	
	# return a jasonify dataframe with columns: isban, title, author

	# for example
	df=pd.DataFrame(columns=['isbn','title','author'])
	df.loc[0]=[1,'book1','author1']
	df.loc[1]=[2,'book2','author2']
	df.loc[2]=[3,'book3','author3']
	return df.to_json(orient='records')

# BookInfo/Favorite
@app.route('/api/favorite/<member_id>/<isbn>', methods=['GET'])
def get_favorite(member_id, isbn):
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "SELECT * FROM favorite WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
        result = cursor.fetchone()
	
    psql_conn.close()
    return jsonify({'found': result is not None})

@app.route('/api/favorite/<member_id>/<isbn>', methods=['POST'])
def add_favorite(member_id, isbn):
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "INSERT INTO favorite (member_id, isbn) VALUES (%s, %s)"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
    psql_conn.commit()
    
    psql_conn.close()
    return jsonify({'message': 'Favorite added successfully'})

@app.route('/api/favorite/<member_id>/<isbn>', methods=['DELETE'])
def delete_favorite(member_id, isbn):
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "DELETE FROM favorite WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Favorite deleted successfully'})
	
# BookInfo/MyReview
@app.route('/api/myReview/<member_id>/<isbn>', methods=['GET'])
def get_myReview(member_id, isbn):
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
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
    
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "INSERT INTO review (member_id, isbn, star_rating, comment, timestamp) VALUES (%s, %s, %s, %s, %s)"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn, data['rating'], data['comment'], datetime.now().strftime("%Y-%m-%d")))
    psql_conn.commit()
    
    psql_conn.close()
    return jsonify({'message': 'Review added successfully'}), 201

@app.route('/api/myReview/<member_id>/<isbn>', methods=['PUT'])
def update_review(member_id, isbn):
    data = request.get_json()
    
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "UPDATE review SET star_rating = %s, comment = %s, timestamp = %s WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (data['rating'], data['comment'], datetime.now().strftime("%Y-%m-%d"), member_id, isbn))
    psql_conn.commit()
    
    psql_conn.close()
    return jsonify({'message': 'Review updated successfully'}), 200

@app.route('/api/myReview/<member_id>/<isbn>', methods=['DELETE'])
def delete_review(member_id, isbn):
    psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
    query = "DELETE FROM review WHERE member_id = %s AND isbn = %s"
    with psql_conn.cursor() as cursor:
        cursor.execute(query, (member_id, isbn))
    psql_conn.commit()

    psql_conn.close()
    return jsonify({'message': 'Review deleted successfully'})

#george_get_followings
@app.route('/api/followings/<member_id>', methods=['GET'])
def get_followings(member_id):
    try:
        # 建立與 PostgreSQL 資料庫的連線
        psql_conn = psycopg2.connect(f"dbname='{dbname}' user='postgres' host='localhost' password='{db_password}'")
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




if __name__ == '__main__':
	app.run(debug=True)
