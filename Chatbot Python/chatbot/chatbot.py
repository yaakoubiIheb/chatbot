from flask import Flask
from flask_restful import Api,Resource
from training import trainingBot
import nltk
from nltk.stem import SnowballStemmer
stemmer = SnowballStemmer("french")

# things we need for Tensorflow
import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
import pandas as pd
import pickle
import random
import json
from tensorflow import keras
from training import trainingBot
from flask import request,make_response
from flask_cors import CORS,cross_origin
import jwt
from functools import wraps
import datetime





app = Flask(__name__)
cors = CORS(app)
api = Api(app)
app.config['SECRET_KEY']='mySecretKey'






def write_json(data, filename='intent.json'):
	with open(filename,'w') as f: 
		json.dump(data, f, indent=4,ensure_ascii=False)



def token_required(f):
	@wraps(f)
	def decorated(*args ,**kwargs ):
		token = None

		if 'token' in request.headers:
			token = request.headers['token']


		if not token:
			return {"message" : "pas de token"}, 403



		try:
			data = jwt.decode(token, app.config['SECRET_KEY'])
			
		except jwt.InvalidTokenError: 
			return {"message" : "Le token n'est pas valide",
			"token" : token,
			"SECRET_KEY" : app.config['SECRET_KEY']}, 403
		except jwt.ExpiredSignatureError:
			return {"message" : "Le token est expiré",
			"token" : token}, 403
		return f(*args, **kwargs)


		

	return decorated










@app.route('/login' , methods=['GET'])
def login():
	token = jwt.encode({
		'user': 'iheb' ,
		 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=600)}
		 ,app.config['SECRET_KEY'],)

	return{"token" : token.decode()}












@app.route('/addRule', methods=['POST'])
#@token_required
def addRule():

	
	with open('intent.json') as json_data:
		intents =json.load(json_data) 
		temp = intents['intents']
		rule=request.get_json(force=True); 
		temp.append(rule)
	write_json(intents)
	trainingBot()	
	return{"data": "régle d'utilisation ajoutée"}






@app.route('/modifyRule', methods=['PUT'])
#@token_required
def modifyRule():

	with open('intent.json') as json_data:
		intents =json.load(json_data)

	temp = intents['intents']
	rule=request.get_json(force=True);
	
	i=0
	for intent in temp:
		if intent['tag'] == rule['tag']:
			intents['intents'][i]=rule
		i=i+1

    	
    
	write_json(intents)
	trainingBot()

	return{"data": "régle d'utilisation modifiée"}









@app.route('/deleteRule/<string:message>', methods=['DELETE'])
#@token_required
def deleteRule(message):

	with open('intent.json') as json_data:
		intents =json.load(json_data)

	temp = intents['intents']
	
	i=0
	for intent in temp:
		if intent['tag'] == message:
			del intents['intents'][i]
		i=i+1

    	
    
	write_json(intents)
	trainingBot()

	return{"data": "régle d'utilisation supprimée"}






@app.route('/chatRes/<string:message>', methods=['GET'])
#@token_required
def chatRes(message):
	#test=trainingBot()
	model= keras.models.load_model("./model")
	data = pickle.load( open( "chatBotData.pkl", "rb" ) )
	words = data['words']
	classes = data['classes']

	def clean_up_sentence(sentence):
	    # tokenize the pattern - split words into array
	    sentence_words = nltk.word_tokenize(sentence)
	    # stem each word - create short form for word
	    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
	    return sentence_words




	# return bag of words array: 0 or 1 for each word in the bag that exists in the sentence
	def bow(sentence, words, show_details=True):
	    # tokenize the pattern
	    sentence_words = clean_up_sentence(sentence)
	    # bag of words - matrix of N words, vocabulary matrix
	    bag = [0]*len(words)  
	    for s in sentence_words:
	        for i,w in enumerate(words):
	            if w == s: 
	                # assign 1 if current word is in the vocabulary position
	                bag[i] = 1
	    return(np.array(bag))


	p=bow("bonjour",words)

	
	


	def classify_local(sentence):
		ERROR_THRESHOLD = 0.25


		with open('intent.json') as json_data:
			intents =json.load(json_data)
		    
		    # generate probabilities from the model
		input_data = pd.DataFrame([bow(sentence, words)], dtype=float, index=['input'])
		results = model.predict([input_data])[0]
		    # filter out predictions below a threshold, and provide intent index
		results = [[i,r] for i,r in enumerate(results) if r>ERROR_THRESHOLD]
		    # sort by strength of probability
		results.sort(key=lambda x: x[1], reverse=True)
		return_list = []
		for r in results:
		    return_list.append((classes[r[0]], str(r[1])))
		label = return_list[0][0]
		    # return tuple of intent and probability
		for intent in intents['intents']:
		    if intent['tag'] == label:
		        res=intent
		return res

	intent=classify_local(message)

	return {"data": intent}









if __name__ =="__main__":
	app.run(host="localhost", port=5000, debug=False)