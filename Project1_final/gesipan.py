from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from databases import Database
from datetime import datetime
import pytz
from sqlalchemy import create_engine, MetaData, Table, select, update, Column, String, Integer, Boolean, DateTime, Numeric, func
from sqlalchemy.sql import and_
import decimal
import logging


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのドメインを許可
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)


# データベース接続URL設定 セキュリティ上の理由で削除しました。
DATABASE_URL1 = "mysql://セキュリティ上の理由で削除しました。:3306/boardDB1_ksr6"
DATABASE_URL2 = "mysql://セキュリティ上の理由で削除しました。:3306/boardDB2_ksr6"
DATABASE_URL3 = "mysql://セキュリティ上の理由で削除しました。:3306/boardDB3_ksr6"

# データベース接続生成
database1 = Database(DATABASE_URL1)
database2 = Database(DATABASE_URL2)
database3 = Database(DATABASE_URL3)

# SQLAlchemyエンジンおよびメタデータ設定
engine1 = create_engine(DATABASE_URL1)
engine2 = create_engine(DATABASE_URL2)
engine3 = create_engine(DATABASE_URL3)
metadata = MetaData()
metadata.bind = engine1

# FastAPIアプリケーションが開始されるときにデータベース接続
@app.on_event("startup")
async def startup():
    await database1.connect()
    await database2.connect()
    await database3.connect()

# FastAPIアプリケーションが終了するときにデータベース接続解除
@app.on_event("shutdown")
async def shutdown():
    await database1.disconnect()
    await database2.disconnect()
    await database3.disconnect()

# 日本現地時間関数
def get_japan_time():
    japan_tz = pytz.timezone('Asia/Tokyo')
    return datetime.now(japan_tz)

# datetimeフォーマット関数
def format_datetime(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S') if dt else None

# データモデル定義
class CreateData(BaseModel):
    purposeIdx: str
    message: str
    mean: decimal.Decimal
    meanAddPhrase: decimal.Decimal
    meanAddMor: decimal.Decimal
    meanAddAll: decimal.Decimal
    runningTime: str
    createdDate: datetime = Field(default_factory=lambda: get_japan_time())
    sendDate: datetime = None  # sendDateフィールド追加
    yesValue: decimal.Decimal
    noValue: decimal.Decimal
    confirmStatus: bool = False

class UpdateData(BaseModel):
    messageId: str
    sendDate: datetime

class AnswerData(BaseModel):
    answerId: str
    messageId: str
    answer: str
    mean: decimal.Decimal
    meanAddPhrase: decimal.Decimal
    meanAddMor: decimal.Decimal
    meanAddAll: decimal.Decimal
    sendDate: datetime
    receiveDate: datetime = None
    yesOrNo: bool


# データID生成関数修正
async def generate_new_id():
    # 直接SQLクエリで最大ID値を取得
    query = "SELECT messageId FROM firstmessages ORDER BY messageId DESC LIMIT 1;"
    result = await database1.fetch_one(query)
    
    if result['messageId']:
        last_id = result['messageId']
        parts = last_id.split('-')
        if len(parts) == 3:
            new_id = f"{parts[0]}-{parts[1]}-{int(parts[2]) + 1}"
        else:
            raise HTTPException(status_code=500, detail="Invalid ID format in the database.")
    else:
        new_id = "2-6-1"
    
    return new_id


# boardDB1_ksr6のfirstmessagesテーブルデータ取得API
@app.get("/api/boardDB1/firstmessages")
async def get_first_messages_db1():
    query = """
    SELECT messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus, sendDate 
    FROM firstmessages
    """

    results = await database1.fetch_all(query=query)
    
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['createdDate'] = format_datetime(result_dict['createdDate'])
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

# boardDB1_ksr6のanswermessagesテーブルデータ取得API
@app.get("/api/boardDB1/answermessages")
async def get_answer_messages_db1():
    query = """
    SELECT answerId, messageId, answer, mean, meanAddPhrase, meanAddMor, meanAddAll, sendDate, receiveDate, yesOrNo 
    FROM answermessages
    """

    results = await database1.fetch_all(query=query)
    
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        result_dict['receiveDate'] = format_datetime(result_dict['receiveDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

# boardDB2_ksr6のfirstmessagesテーブルデータ取得API
@app.get("/api/boardDB2/firstmessages")
async def get_firstmessages_db2():
    query = """
    SELECT messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus, sendDate 
    FROM firstmessages
    """
    results = await database2.fetch_all(query=query)
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['createdDate'] = format_datetime(result_dict['createdDate'])
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

# boardDB3_ksr6のfirstmessagesテーブルデータ取得API
@app.get("/api/boardDB3/firstmessages")
async def get_firstmessages_db3():
    query = """
    SELECT messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus, sendDate 
    FROM firstmessages
    """
    results = await database3.fetch_all(query=query)
    if not results:
        raise HTTPException(status_code=404, detail="No data found")
    
    formatted_results = []
    for result in results:
        result_dict = dict(result)
        result_dict['createdDate'] = format_datetime(result_dict['createdDate'])
        result_dict['sendDate'] = format_datetime(result_dict['sendDate'])
        formatted_results.append(result_dict)
    
    return formatted_results

logging.basicConfig(level=logging.INFO)

# boardDB1_ksr6のfirstmessagesテーブルにデータ挿入API 保存される場所がDB 123全部
@app.post("/boardDB/firstmessages")
async def create_firstmessage(data: CreateData):
    new_Id = await generate_new_id()  # 新しいID生成
    japan_time = get_japan_time()     # 日本現地時間
    #  sendDate, :sendDate,
    query = """
    INSERT INTO firstmessages (messageId, purposeIdx, message, mean, meanAddPhrase, meanAddMor, meanAddAll, runningTime, createdDate, yesValue, noValue, confirmStatus)
    VALUES (:messageId, :purposeIdx, :message, :mean, :meanAddPhrase, :meanAddMor, :meanAddAll, :runningTime, :createdDate, :yesValue, :noValue, :confirmStatus)
    """
    
    values = {
        "messageId": new_Id,
        "purposeIdx": data.purposeIdx,
        "message": data.message,
        "mean": float(data.mean),
        "meanAddPhrase": float(data.meanAddPhrase),
        "meanAddMor": float(data.meanAddMor),
        "meanAddAll": float(data.meanAddAll),
        "runningTime": data.runningTime,
        "createdDate": japan_time,
        # "sendDate": format_datetime(japan_time),
        "yesValue": float(data.yesValue),
        "noValue": float(data.noValue),
        "confirmStatus": data.confirmStatus
    }

    try:
        await database1.execute(query=query, values=values)
        await database2.execute(query=query, values=values)
        await database3.execute(query=query, values=values)
    except Exception as e:
        logging.error(f"Database insertion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"success": True, "message": "Data inserted successfully"}

# messageId基準でsendDate修正API 保存される場所がDB 123全部
@app.put("/boardDB1/firstmessages/{messageId}")
async def update_senddate(messageId: str):
    japan_time = get_japan_time()  # 日本現地時間
    
    firstmessages1 = Table('firstmessages', metadata, autoload_with=engine1)
    firstmessages2 = Table('firstmessages', metadata, autoload_with=engine2)
    firstmessages3 = Table('firstmessages', metadata, autoload_with=engine3)
    
    query1 = update(firstmessages1).where(firstmessages1.c.messageId == messageId).values(sendDate=japan_time)
    query2 = update(firstmessages2).where(firstmessages2.c.messageId == messageId).values(sendDate=japan_time)
    query3 = update(firstmessages3).where(firstmessages3.c.messageId == messageId).values(sendDate=japan_time)

    try:
        await database1.execute(query=query1)
        await database2.execute(query=query2)
        await database3.execute(query=query3)
        
        # 更新されたデータを再度取得して返す
        # query = select([firstmessages1.c.sendDate]).where(firstmessages1.c.messageId == messageId)
        # result = await database1.fetch_one(query)
        
        # if result is None:
        #     raise HTTPException(status_code=404, detail="Message ID not found")
        
        # formatted_send_date = format_datetime(result['sendDate'])
        # formatted_send_date = format_datetime(result[firstmessages1.c.sendDate])
        # formatted_send_date = format_datetime(result[0])
    except Exception as e:
        logging.error(f"Database update error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "success": True,
        "message": "sendDate updated successfully",
        "sendDate": format_datetime(japan_time)
    }

# FastAPIアプリケーション実行
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5006)
