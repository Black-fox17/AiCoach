from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from auth import insert_data,get_all_data,get_signin_info
from user import get_user_progress,get_workout_sessions,add_user_progress
import json

origins = ['http://localhost:5173']

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class Signup(BaseModel):
    name:str
    email:str
    password:str

class Signin(BaseModel):
    email:str
    password:str

class User(BaseModel):
    email:str

class Progress(BaseModel):
    progress: dict
    email:str

@app.post("/api/signup")
async def create_signup(input_data:Signup):
    print(input_data)
    full_name = input_data.name
    email = input_data.email
    password = input_data.password
    with open("output.json","w") as f:
        json.dump([{"email":email,"password":password}],f)
    all_data = get_all_data()
    if email not in all_data:
        try:
            insert_data(full_name,email,password)
        except Exception as e:
            print(f"Error occured adding data {e}")
        return {"result":"no"}
    else:
        return {"result":"yes"}

@app.post("/api/signin")
async def create_signin(input_data:Signin):
    email = input_data.email
    password = input_data.password
    results = get_signin_info()
    for record in results:
        if record[0] == email and record[1] == password:
            return {"status": "success", "message": email,'name':record[2]}
    return {"status": "failure"}

@app.get("/api/user")
async def get_user_info(authorization: str = Header(...)):
    # Extract the email from the Authorization header (assuming it's the token)
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid token format")
    
    email = authorization.split(" ")[1]  # Extract the email
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided")
    
    # Replace with actual data-fetching logic
    workout_sessions = get_workout_sessions(email)
    user_progress = get_user_progress(email)

    return {"user_progress": user_progress, "workout_sessions": workout_sessions}


@app.post('/api/update_progress')
async def update_progress(input_data:Progress):
    email = input_data.email
    progress = input_data.progress
    print(progress)
    output = add_user_progress(email,progress["workoutsCompleted"],progress["totalMinutes"],progress["averageAccuracy"],progress["streak"])
    return {"result":output}