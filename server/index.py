import os
import json
from flask import Flask, request, make_response, g
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import json_util
from pydantic import BaseModel, ValidationError, constr

# load stuff from env file
load_dotenv()
DATABASE_URI = os.environ['DATABASE_URI']

app = Flask(__name__)
CORS(app)

# catch all errors
@app.errorhandler(Exception)
def handle_error(error):
    return make_response(error.args[0], 500)

# connect to cluster and get the database
def get_db():
    if 'db' not in g:
        g.db = MongoClient(DATABASE_URI)['unboom']
    return g.db

@app.teardown_appcontext
def close_db(error):
    if 'db' in g:
        g.db.client.close()

# schema for data validation
class Score(BaseModel):
    name: constr(max_length = 50)
    duration: constr(max_length = 10)
    created: constr(max_length = 20)

# get scores
@app.route("/", methods = ["GET"])
def get_scores():
    # get the score collection
    scores = get_db()['score']
    
    scores_response = list(scores.find())
    return json.dumps(scores_response, default=json_util.default)

# add score
@app.route("/", methods = ["POST"])
def add_score():
    # validate data in request
    try:
        Score(**request.json)
    except ValidationError as error:
        return make_response(error.errors()[0]["msg"], 400)

    # get the score collection
    scores = get_db()['score']
    
    # add data to database
    user_score_added = scores.insert_one(request.json)
    return str(user_score_added.inserted_id)