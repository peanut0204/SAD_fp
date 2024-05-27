import uuid
import ast
import datetime
import shortuuid
import psycopg2
import warnings
warnings.filterwarnings('ignore')

from flask import Flask, request, abort, redirect, session, url_for, render_template_string
from linebot import LineBotApi, WebhookHandler, WebhookParser
from linebot.exceptions import InvalidSignatureError

from linebot.models import (
    MessageEvent, TextMessage, PostbackEvent, TextSendMessage, TemplateSendMessage, 
    ConfirmTemplate, MessageTemplateAction, ButtonsTemplate, 
    PostbackTemplateAction, URITemplateAction, CarouselTemplate, CarouselColumn, ImageCarouselTemplate, ImageCarouselColumn, 
    QuickReply, QuickReplyButton, MessageAction, ButtonsTemplate, URIAction)
from urllib.parse import parse_qsl
from apscheduler.schedulers.background import BackgroundScheduler
from linebot.models.events import MessageEvent
from threading import Thread
from threading import Timer
import time
from linebot.models import MessageEvent, TextMessage, PostbackEvent, TextSendMessage, TemplateSendMessage, ConfirmTemplate, MessageTemplateAction, ButtonsTemplate, PostbackTemplateAction, URITemplateAction, CarouselTemplate, CarouselColumn, ImageCarouselTemplate, ImageCarouselColumn

# 讀取資料庫密碼
app = Flask(__name__)
with open('db_password.txt', 'r') as file:
    db_password = file.read().strip()


# 資料庫連接設定
dbname = 'ShoppingGO'
db_user = 'postgres'      # 請更換為你的資料庫用戶名
db_host = 'localhost'     # 如果資料庫在本地，否則更換為相應的主機名
db_port = '5432'          # 資料庫服務器端口，預設為5432


# 建立資料庫連接
conn = psycopg2.connect(dbname=dbname, user=db_user, password=db_password, host=db_host, port=db_port)

  
def get_districts():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM groups;")
    rows = cursor.fetchall()
    
    # 創建一個集合用於存儲不重複的區域資訊
    unique_districts = set()
    
    # 遍歷所有資料行，將區域資訊添加到集合中
    for r in rows:
        district = r[2].split('區')[0].split('市')[-1] + '區'
        unique_districts.add(district)
    
    # 將集合轉換為列表，確保區域資訊不重複
    districts = list(unique_districts)
    
    group_idx = [r[0] for r in rows]
    cursor.close()
    return districts, group_idx


def get_group_id():
    cursor = conn.cursor()
    query = "SELECT group_id, group_name FROM groups"
    cursor.execute(query,)
    rows = cursor.fetchall()
    gp_id = [r[0] for r in rows]
    gp_name = [r[1] for r in rows]
    return gp_id, gp_name
    

# def get_group_user_in():
#     cursor = conn.cursor()
#     query = "SELECT group_id, group_name FROM groups"
#     cursor.execute(query,)
#     rows = cursor.fetchall()
    
#     # 創建一個集合用於存儲不重複的區域資訊
#     unique_districts = set()
    
#     # 遍歷所有資料行，將區域資訊添加到集合中
#     for r in rows:
#         district = r[1]
#         unique_districts.add(district)
    
#     # 將集合轉換為列表，確保區域資訊不重複
#     districts = list(unique_districts)
    
#     group_idx = [r[0] for r in rows]
#     cursor.close()
#     print(districts,group_idx,'fuckerjgnhkwe.;jtbngkjw.ejrtbgkjw.erg')
#     return districts, group_idx


""" 
Mapping from groups to districts. For example:
{'中正區': ['天鄰里團購群'], '士林區': ['幸福人妻'], '大安區': ['濟南FAMILY'], '苓雅區': ['美食烹飪團隊'], 
'板橋區': ['健身俱樂部'], '萬華區': ['大安阿曼團購群'], '信義區': ['科技愛好者團體', '文化三星']}
"""
def groups_to_district(all_areas):
    cursor = conn.cursor()
    query = "SELECT * FROM groups"
    cursor.execute(query)
    rows = cursor.fetchall()
    
    tmp_dict = dict()
    for ar in all_areas:
        tmp_dict[ar] = []

    for r in rows:
        district = r[2].split('區')[0].split('市')[-1] + '區'
        tmp_dict[district].append(r[0]) # Save the group_id
    
    return tmp_dict


def get_groups_from_idx(ids):
    cursor = conn.cursor()
    query = "SELECT * FROM groups WHERE group_id = ANY(%s)"
    cursor.execute(query, (ids,))
    rows = cursor.fetchall()
    return rows


def get_goods_from_group(group_name, group_dict1):
    grp_id = group_dict1[group_name]
    print(grp_id,group_name)
    cursor = conn.cursor()
    query = "SELECT goods.goods_picture_line, goods.tag, goods.goods_name, goods.unite_price, goods.min_quantity, goods.goods_description, goods.goods_id\
            FROM goods\
            WHERE goods.group_id = %s"
    cursor.execute(query, (grp_id,))
    rows = cursor.fetchall()
    print(rows)
    return rows
    
    
    # group_id (大安區) --> seller_participation --> seller_id --> goods
    # grp_id = group_dict[group_name]
    # cursor = conn.cursor()
    # query = "SELECT seller_id FROM seller_participation WHERE group_id = %s;"
    # cursor.execute(query, (grp_id,))
    # row = cursor.fetchall()  # seller_id

    # # Get goods by seller id
    # rowss = []
    # for arow in row:
    #     cursor = conn.cursor()
    #     query = "SELECT goods.goods_picture, goods.tag, goods.goods_name, goods.unite_price, goods.min_quantity, goods.goods_description, goods.goods_id\
    #             FROM goods\
    #             WHERE goods.seller_id = %s and goods.logistic_status != '取消' and goods.logistic_status != '已送達';"
    #     cursor.execute(query, (arow,))
    #     rows = cursor.fetchall()
    #     rowss += rows

    # return rowss

    # # Get goods by seller id
    # if row:
    #     cursor = conn.cursor()
    #     query = "SELECT goods.goods_picture, goods.tag, goods.goods_name, goods.unite_price, goods.min_quantity, goods.goods_description, goods.goods_id\
    #             FROM goods\
    #             WHERE goods.seller_id = %s and goods.logistic_status != '取消' and goods.logistic_status != '已送達';"
    #     cursor.execute(query, (row[0],))
    #     rows = cursor.fetchall()
    #     return rows
    # return []
        


"""Global variables"""
line_bot_api = LineBotApi('K+mmmFpbOzkLrEVwJTWRfUjRv70UZV1BpzO0jW1UzUUvtn0kWqql+AWfJNR8AB/AyF3UDLzUuN3NCngde23JksJevmaVNiKNAQI9slRGpBJp/Rlm13EZjl/mvQD/XsL/1sI5FZNTv/cOJQStiRIOewdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('e16f7564af72fabfc19d845f4d2877f0')# b4db5feb35a9390ea7b07008b1abdcd7
parser = WebhookParser('e16f7564af72fabfc19d845f4d2877f0')# b4db5feb35a9390ea7b07008b1abdcd7
user_states = {}
areas, group_ids = get_districts()
groupidd, groupsname = get_group_id()
dis2grp = groups_to_district(areas) # a dict mapping from districts to group names
group_dict1 = {group: groupidd for group, groupidd in zip(groupsname, groupidd)}


"""App functions"""
@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature'] 
    body = request.get_data(as_text=True)
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        abort(400)

    events = parser.parse(body, signature)
    for event in events:
        if isinstance(event, PostbackEvent):
            handle_postback(event)
    return 'OK'


def handle_event(event):
    if isinstance(event, PostbackEvent):
        handle_postback(event)



def handle_postback(event):
    data = event.postback.data
        
    # Assuming the data is in the format 'action=buy&item=item_name'
    action, item = data.split('&')
    _, action_value = action.split('=')
    _, item_name = item.split('=')
    if action_value == 'order':
        process_purchase(event, list(ast.literal_eval(item_name)))
    elif action_value == 'description':
        process_description(event, list(ast.literal_eval(item_name)))
    elif action_value == 'joingroup':
        process_join_grp(event, list(ast.literal_eval(item_name)))




# def process_purchase(event, row):
#     # Insert into database "order"
#     cursor = conn.cursor()
#     query = "INSERT INTO orders (buyer_id, goods_id, quantity, order_time, order_status, comment, star_rating) VALUES (%s, %s, %s, %s, %s, %s, %s)"
#     user_id = event.source.user_id
#     q_data = (user_id, row[5], 3, datetime.datetime.now(), '已下單', '', 3) 
#     cursor.execute(query, q_data)
#     conn.commit()
    
#     # Sending a confirmation message to the user
#     line_bot_api.reply_message(
#         event.reply_token,
#         TextSendMessage(text=f"感謝您購買： {row[1]}!")
#     )

def process_purchase(event, row):
    # 檢查資料庫中是否已經存在相同的使用者資料
    cursor = conn.cursor()
    query = "SELECT COUNT(*) FROM orders WHERE buyer_id = %s and goods_id = %s"
    user_id = event.source.user_id
    cursor.execute(query, (user_id,row[5]))
    count = cursor.fetchone()[0]
    
    if count > 0:
        # 如果已存在相同的資料，則傳送已註冊的訊息給使用者
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="您已經購買過了！")
        )
    else:
        # Insert into database "order"
        cursor = conn.cursor()
        query = "INSERT INTO orders (buyer_id, goods_id, quantity, order_time, order_status, comment, star_rating) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        user_id = event.source.user_id
        q_data = (user_id, row[5], 0, datetime.datetime.now(), '已下單', '', 3) 
        cursor.execute(query, q_data)
        conn.commit()
        
        # Ask the amount of the order
        items = [
            QuickReplyButton(
                action=MessageAction(label=i+1, text=f'Amount:{i+1}')
            ) for i in range(10)
        ]
        message = TextSendMessage(
            text='請選擇購買數量',
            quick_reply=QuickReply(items=items)
        )
        line_bot_api.reply_message(event.reply_token, message)
        
        
        
    
def process_description(event, row):
    # Display the description
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=f"{row[1]}: {row[4]}")
    )

def process_join_grp(event, row):
    # Check the database
    cursor = conn.cursor()
    query = "Select * From buyer_participation where buyer_id = %s and group_id = %s"
    user_id = event.source.user_id
    q_data = (user_id, row[0]) 
    cursor.execute(query, q_data)
    res = cursor.fetchall()
    
    message = f"你已經加入過{row[1]}社群了！"
    if len(res) == 0:
        # Update the database
        cursor = conn.cursor()
        query = "INSERT INTO buyer_participation (buyer_id, group_id) VALUES (%s, %s)"
        user_id = event.source.user_id
        q_data = (user_id, row[0]) 
        cursor.execute(query, q_data)
        conn.commit()
        message = f"成功加入社群： {row[1]}!"
        
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=message)
    )
    


# def view_order(event):
#     try:
#         cursor = conn.cursor()
#         query = "SELECT COUNT(*) FROM orders JOIN goods ON goods.goods_id = orders.goods_id WHERE buyer_id = %s"
#         user_id = event.source.user_id
#         cursor.execute(query, (user_id,))
#         result = cursor.fetchone()
        
#         if result is not None:  # 檢查是否有結果返回
#             count = result[0]
#             if count == 0:
#                 line_bot_api.reply_message(
#                     event.reply_token,
#                     TextSendMessage(text="您尚未團購任何商品！")
#                 )
#             else:
#                 # 在這裡添加處理有訂單的情況的程式碼
#                 pass
#         else:
#             print("No records found for the user.")
#     except Exception as e:
#         print("An error occurred:", e)


def view_order(event):
    cursor = conn.cursor()
    query = "SELECT COUNT(*) FROM orders JOIN goods ON goods.goods_id = orders.goods_id WHERE buyer_id = %s"
    user_id = event.source.user_id
    cursor.execute(query, (user_id,))
    result = cursor.fetchone()[0]
    
    if result == 0:  # 檢查是否有結果返回
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="您尚未團購任何商品！")
        )

    else:
        cursor = conn.cursor()
        query = "SELECT orders.quantity, orders.order_time, goods.goods_name, orders.order_status, goods.goods_picture_line, goods.goods_description FROM orders \
                Join goods on goods.goods_id = orders.goods_id  WHERE buyer_id = %s ORDER BY orders.order_time DESC;"
        user_id = event.source.user_id
        q_data = (user_id,)  
        cursor.execute(query, q_data)
        result = cursor.fetchall()

        columns = []
        for row in result:
            new_row = [row[i] if i >= 2 else '' for i in range(len(row))]
            new_row = [0, new_row[2], 0, 0, new_row[5]]
            columns.append(
                CarouselColumn(
                    thumbnail_image_url=f'{row[4]}', 
                    title=f'商品名: {row[2]}',  
                    text=f'購買數量: {row[0]}\n購買時間: {row[1]}\n訂單狀態: {row[3]}',
                    actions=[
                        PostbackTemplateAction(
                            label='更多資訊',
                            data=f'action=description&item={new_row}'
                        )
                    ]
                )
            )
        sendCarousel(event, columns)


# def check_db_notification():
#     cursor = conn.cursor()
#     query = "SELECT * FROM goods WHERE notification_status = '未通知'"
#     cursor.execute(query)
#     result = cursor.fetchall()
    
#     if result:
#         for row in result:
#             line_bot_api.push_message('YOUR_USER_ID', TextSendMessage(text='Database has changed!'))
    
#     conn.close()

def get_user_data(event):
    # 獲取使用者的 Line ID
    user_id = event.source.user_id
    
    # 使用 Line Bot API 獲取使用者的個人資訊
    profile = line_bot_api.get_profile(user_id)
    
    # 獲取使用者的名稱
    user_name = profile.display_name

    user_picture = profile.picture_url
    
    # # 在這裡可以使用 user_name 進行後續的處理
    # print("使用者的名稱:", user_name)
    
    # # 在這裡可以使用 user_id 進行後續的處理
    # print("使用者的 Line ID:", user_id)

    # print("使用者的照片：",user_picture)
    used_data = [user_id,user_name ,user_picture]
    return used_data


def sign_in(event):
    # 檢查資料庫中是否已經存在相同的使用者資料
    cursor = conn.cursor()
    query = "SELECT COUNT(*) FROM buyer WHERE buyer_account = %s"
    user_id = event.source.user_id
    cursor.execute(query, (user_id,))
    count = cursor.fetchone()[0]
    
    if count > 0:
        # 如果已存在相同的資料，則傳送已註冊的訊息給使用者
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="您已經註冊過了！")
        )
    else:
        # 如果資料庫中不存在相同的資料，則進行註冊操作
        query = "INSERT INTO buyer (buyer_account, buyer_phonenumber, buyer_name, buyer_picture, buyer_password) VALUES (%s, %s, %s, %s, %s)"
        q_data = (get_user_data(event)[0], 1234567890, get_user_data(event)[1], get_user_data(event)[2], 1234567890)
        cursor.execute(query, q_data)
        conn.commit()

        # 發送註冊成功的訊息給使用者
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="註冊成功！\n 目前密碼與電話預設為:\n 1234567890 \n 請至揪團GO!官網修改！")
        )

# # 接收使用者輸入的註冊資料
# def handle_signup(event):
#     try:
#         print(event)
#         # 檢查訊息是否符合預期格式
#         if ' ' not in event.message.text:
#             raise ValueError("訊息格式不正確")

#         # 從使用者訊息中提取電話號碼和密碼
#         buyer_phonenumber, buyer_password = event.message.text.split()
#         return buyer_phonenumber, buyer_password
#     except ValueError as e:
#         # 如果無法提取資訊，回傳 None
#         return None, None

# def sign_in(event, buyer_phonenumber, buyer_password):
#     # 檢查資料庫中是否已經存在相同的使用者資料
#     cursor = conn.cursor()
#     query = "SELECT COUNT(*) FROM buyer WHERE buyer_account = %s"
#     user_id = event.source.user_id
#     cursor.execute(query, (user_id,))
#     count = cursor.fetchone()[0]
    
#     if count > 0:
#         # 如果已存在相同的資料，則傳送已註冊的訊息給使用者
#         line_bot_api.reply_message(
#             event.reply_token,
#             TextSendMessage(text="您已經註冊過了！")
#         )
#     else:
#         # 從事件中獲取使用者輸入的電話號碼和密碼
#         buyer_phonenumber = event.message.text.split()[0]  # 假設使用者將電話號碼和密碼用空格分隔
#         buyer_password = event.message.text.split()[1]

#         # 進行註冊操作
#         query = "INSERT INTO buyer (buyer_account, buyer_phonenumber, buyer_name, buyer_picture, buyer_password) VALUES (%s, %s, %s, %s, %s)"
#         q_data = (get_user_data(event)[0], buyer_phonenumber, get_user_data(event)[1], get_user_data(event)[2], buyer_password)
#         cursor.execute(query, q_data)
#         conn.commit()

#         # 發送註冊成功的訊息給使用者
#         line_bot_api.reply_message(
#             event.reply_token,
#             TextSendMessage(text="註冊成功！\n 目前密碼與電話預設為:\n 1234567890 \n 請至揪團GO!官網修改！")
#         )



# 定義推播函式
def push_notification(event):
    cursor = conn.cursor()
    query = "SELECT COUNT(*) FROM goods Join orders on orders.goods_id = goods.goods_id  WHERE notification_status != '已通知' and orders.buyer_id = %s;"
    user_id = event.source.user_id
    cursor.execute(query, (user_id,))
    count = cursor.fetchone()[0]
    print(count)
    if count == 0:
        (
            # 如果已存在相同的資料，則傳送已註冊的訊息給使用者
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text="目前訂單狀態無更新！")
        )
        )

    else:
    # 查詢資料庫，檢查是否有未通知的商品
        cursor = conn.cursor()
        query = "SELECT goods.goods_id,goods.goods_name,goods.logistic_status FROM goods Join orders on orders.goods_id = goods.goods_id  WHERE notification_status != '已通知' and orders.buyer_id = %s;"
        user_id = event.source.user_id
        q_data = (user_id,)  
        cursor.execute(query, q_data)
        rows = cursor.fetchall()
        print(rows)
        for row in rows:
            # print(rows)
            # 取得商品相關資訊
            goods_id = row[0]
            goods_name = row[1]
            status = row[2]
            # 執行推播
            # user_id = row[3]# 替換為實際的使用者 Line ID
            
            message = TextSendMessage(text=f"提醒您！！\n您的商品 '{goods_name}' \n 最新狀況為:{status}")
            #line_bot_api.reply_message(event.reply_token,message)
            line_bot_api.push_message(user_id, message)
            # 更新商品的通知狀態為 '已通知'
            cursor.execute("UPDATE goods SET notification_status = '已通知' WHERE goods_id = %s;", (goods_id,))
            conn.commit()

# # 初始化定時任務
# scheduler = BackgroundScheduler()
# scheduler.add_job(push_notification, 'interval', seconds=5)  # 每60秒執行一次推播任務
# scheduler.start()

# # 保持主程式運行
# try:
#     while True:
#         pass
# except KeyboardInterrupt:
#     scheduler.shutdown()
#     conn.close()



@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):

    userID = 0
    mtext = event.message.text
    
    if mtext.startswith('Amount:'):
        # Revise the amount
        cursor = conn.cursor()
        query = "SELECT orders.buyer_id, orders.goods_id, goods.goods_name FROM orders JOIN goods on orders.goods_id = goods.goods_id \
                WHERE orders.order_time = (SELECT MAX(orders.order_time) FROM orders) and orders.buyer_id = %s;"
        user_id = event.source.user_id
        cursor.execute(query, (user_id,))
        res = cursor.fetchone()
        
        # Write into the DB
        new_amount = int(mtext.split(':')[-1])
        print("Amount:", new_amount)

        cursor = conn.cursor()
        query = "UPDATE orders SET quantity = %s WHERE buyer_id = %s and goods_id = %s"
        cursor.execute(query, (new_amount, res[0], res[1]))
        conn.commit()

        message = TextSendMessage(  
            text = f"成功下訂{new_amount}份{res[2]}"
        )

        # const url = useUrl()
        # url.getParams(userId)
        line_bot_api.reply_message(event.reply_token,message)
    
    elif mtext == '@傳送文字':
        try:
            message = TextSendMessage(  
                text = f"我是 李冠緯海軍陸戰隊，\n您好！! http://localhost:5000?userId={userID}"
            )

            # const url = useUrl()
            # url.getParams(userId)
            line_bot_api.reply_message(event.reply_token,message)
        except:
            line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))
    
    elif mtext == '@我的訂單':
        try:
            # Get group's goods by seller_participation
            view_order(event)
            
        except:
            line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))

    
    # """ 1. Deal with the data in districts picked """
    elif mtext in areas: 
        try:
            # Get groups' id by selected area name
            grp_ids = dis2grp[mtext]
            data = get_groups_from_idx(grp_ids)
            
            # Set reply messages    
            if data == []:
                reply_message = "此區目前暫時無社群"
                line_bot_api.reply_message(event.reply_token, TextSendMessage(text=reply_message))
            else:
                columns = []
                for row in data:
                    columns.append(
                        CarouselColumn(
                            thumbnail_image_url='https://www.foun.com.tw/web/image/product.template/13/image_1024?unique=7622847', # TODO: Need to change
                            title=f'社群名: {row[1]}',  
                            text=f'社群地址: {row[2]}\n是否加入該社群?', 
                            
                            actions=[
                                PostbackTemplateAction(  # 顯示文字計息
                                    label='馬上加入社群',
                                    data=f'action=joingroup&item={row}'
                                ),
                                MessageTemplateAction(  # 顯示文字計息
                                    label='先不加入社群',
                                    text='先不加入社群'
                                )
                            ]
                        )
                    )
                sendCarousel(event, columns)
                
        except Exception as e:
            print(f"Error fetching data from database: {e}")
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤！'))
            
            
    elif mtext == '@獲取商品':
        try:
            items = [
                QuickReplyButton(
                    action=MessageAction(label=area, text=area)
                ) for area in areas
            ]
            message = TextSendMessage(
                text='請選擇地區',
                quick_reply=QuickReply(items=items)
            )
            line_bot_api.reply_message(event.reply_token, message)
        except Exception as e:
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤：' + str(e)))

    elif mtext == '@加入新社群':
        try:
            items = [
                QuickReplyButton(
                    action=MessageAction(label=area, text=area)
                ) for area in areas
            ]
            message = TextSendMessage(
                text='請選擇地區',
                quick_reply=QuickReply(items=items)
            )
            line_bot_api.reply_message(event.reply_token, message)
        except Exception as e:
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤：' + str(e)))


    
    # """ 2. """
    elif mtext in groupsname: 
        try:
            # Get group's goods by seller_participation
            data = get_goods_from_group(mtext, group_dict1)
            
            # Set reply messages    
            if data == []:
                reply_message = "沒有商品"
                line_bot_api.reply_message(event.reply_token, TextSendMessage(text=reply_message))
            else:
                columns = []
                for row in data:
                    columns.append(
                        CarouselColumn(
                            thumbnail_image_url=f'{row[0]}',
                            title=f'商品名: {row[2]}',  
                            text=f'商品類型: {row[1]}\n價格: {row[3]}\n最低開團人數下限: {row[4]}\n', 
                            
                            actions=[
                                PostbackTemplateAction(
                                    label='下單',
                                    data=f'action=order&item={row[1:]}'
                                ),
                                PostbackTemplateAction(
                                    label='更多資訊',
                                    data=f'action=description&item={row[1:]}'
                                )
                            ]
                        )
                    )
                sendCarousel(event, columns)
                
        except Exception as e:
            print(f"Error fetching data from database: {e}")
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤！'))

    elif mtext == '@獲取已追蹤社群商品':
        try:
            cursor = conn.cursor()
            query = "SELECT groups.group_name FROM buyer_participation as bp \
                    JOIN groups on bp.group_id = groups.group_id WHERE bp.buyer_id = %s;"
            user_id = event.source.user_id
            cursor.execute(query, (user_id,))
            group_rows = cursor.fetchall()

            
            if len(group_rows) == 0:
                message = TextSendMessage(
                    text='目前沒有追蹤的社群'
                )
                
            else:
                items = [
                    QuickReplyButton(
                        action=MessageAction(label=group[0], text=group[0])
                    ) for group in group_rows
                ]
                message = TextSendMessage(
                    text='請選擇已追蹤社群',
                    quick_reply=QuickReply(items=items)
                )
            line_bot_api.reply_message(event.reply_token, message)
        except Exception as e:
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤：' + str(e)))    

    # elif mtext == '@會員資料':
    #     try:
    #         # Get group's goods by seller_participation
    #         get_user_data(event)
    #         message = TextSendMessage(  
    #             text = f"你的帳號是：{get_user_data(event)[0]}\n 你的名字是：{get_user_data(event)[1]} \n \n \n 是否進行註冊？" ,
    #             quick_reply=QuickReply(
    #                 items=[
    #                     QuickReplyButton(
    #                         action=MessageAction(label="是，進行註冊", text="是，進行註冊")
    #                     ),
    #                     QuickReplyButton(
    #                         action=MessageAction(label="不了，先不要", text="不了，先不要")
    #                     ),
    #                 ]
    #             )
    #         )
    #         line_bot_api.reply_message(event.reply_token,message)

    #     except:
    #         line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))

    elif mtext == '@會員資料':
        try:
            print(get_user_data(event))
            message = TemplateSendMessage(
                alt_text='按鈕樣板',
                template=ButtonsTemplate(
                    thumbnail_image_url= get_user_data(event)[2],  # 顯示的圖片
                    title=f'姓名：{get_user_data(event)[1]} ',  # 主標題
                    text = f"帳號如下：{get_user_data(event)[0]} \n是否進行註冊？" , # 副標題
                    actions=[
                        MessageTemplateAction(  # 顯示文字計息
                            label='是，進行註冊',
                            text='是，進行註冊'
                        ),
                        MessageTemplateAction(  # 顯示文字計息
                            label='不了，先不要',
                            text='不了，先不要'
                        )
                    ]
                )
            )
            line_bot_api.reply_message(event.reply_token, message)
        except Exception as e:
            print(e)
            line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤！'))
            
    elif mtext == '是，進行註冊':
        try:
            sign_in(event)
        except:
            line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))

    # elif mtext == '是，進行註冊':
    #     try:
    #         # 詢問使用者是否進行註冊
    #         message = TextSendMessage(  
    #             text = "請輸入您的電話號碼和密碼，以空格分隔，例如：0987654321 123456",
    #         )
    #         line_bot_api.reply_message(event.reply_token, message)


    #         buyer_phonenumber, buyer_password = handle_signup(event)
    #         if buyer_phonenumber is None or buyer_password is None:
    #             # 如果無法提取資訊，回傳錯誤訊息
    #             raise ValueError("無法解析電話號碼和密碼")
            
    #         print(buyer_phonenumber, buyer_password)  
    #             # 進行註冊操作
    #         sign_in(event,buyer_phonenumber, buyer_password)
    #     except:
    #         line_bot_api.reply_message(event.reply_token, TextSendMessage(text='發生錯誤！'))


    elif mtext == '不了，先不要':
        try:
            message = TextSendMessage(  
                text = "提醒您，若尚未註冊就不能購買商品喔！"
            )

            # const url = useUrl()
            # url.getParams(userId)
            line_bot_api.reply_message(event.reply_token,message)
        except:
            line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))
            
    elif mtext == '@查看最新通知':
        try:
            push_notification(event)
        except:
            line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))


"""Design for 轉盤"""            
def sendCarousel(event, columns):  #轉盤樣板
    try:
        message = TemplateSendMessage(
            alt_text='商品轉盤',
            template=CarouselTemplate(columns=columns)
        )
        line_bot_api.reply_message(event.reply_token,message)
    except:
        line_bot_api.reply_message(event.reply_token,TextSendMessage(text='發生錯誤！'))

        
if __name__ == '__main__':
    app.run()