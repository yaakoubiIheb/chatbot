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
import weakref




		
def trainingBot():
	with open('intent.json') as json_data:
		intents =json.load(json_data)
	words = []
	classes = []
	documents = []
	ignore_words = ['?']

		




    	
# loop through each sentence in our intents patterns
	for intent in intents['intents']:
		for trigger in intent['trigger']:
			w = nltk.word_tokenize(trigger)
			words.extend(w)
			documents.append((w, intent['tag']))
			if intent['tag'] not in classes:
				classes.append(intent['tag'])


	words = [stemmer.stem(w.lower()) for w in words if w not in ignore_words]
	words = sorted(list(set(words)))
	classes = sorted(list(set(classes)))


	training = []
	output_empty = [0] * len(classes)


	
	# create an empty array for our output
	

	# training set, bag of words for each sentence
	for doc in documents:
	    # initialize our bag of words
	    bag = []
	    # list of tokenized words for the pattern
	    pattern_words = doc[0]
	    # stem each word - create base word, in attempt to represent related words
	    pattern_words = [stemmer.stem(word.lower()) for word in pattern_words]
	    # create our bag of words array with 1, if word match found in current pattern
	    for w in words:
	        bag.append(1) if w in pattern_words else bag.append(0)
	    # output is a '0' for each tag and '1' for current tag (for each pattern)
	    output_row = list(output_empty)
	    output_row[classes.index(doc[1])] = 1
	    
	    training.append([bag, output_row])
	# shuffle our features and turn into np.array
	random.shuffle(training)
	training = np.array(training,dtype="object")

	# create train and test lists. X - patterns, Y - intents
	train_x = list(training[:,0])
	train_y = list(training[:,1])

	





			# Create model - 3 layers. First layer 128 neurons, second layer 64 neurons and 3rd output layer contains number of neurons
	# equal to number of intents to predict output intent with softmax
	model = Sequential()
	model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
	model.add(Dropout(0.5))
	model.add(Dense(64, activation='relu'))
	model.add(Dropout(0.5))
	model.add(Dense(len(train_y[0]), activation='softmax'))



			# Compile model. Stochastic gradient descent with Nesterov accelerated gradient gives good results for this model
	sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
	model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])


			# Fit the model
	model.fit(np.array(train_x), np.array(train_y), epochs=200, batch_size=5, verbose=1)



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
	inputvar = pd.DataFrame([p], dtype=float, index=['input'])
	print(model.predict(inputvar))
	

	model.save("./model");
	pickle.dump( {'words':words, 'classes':classes, 'train_x':train_x, 'train_y':train_y}, open( "chatBotData.pkl", "wb" ) )

	return True
