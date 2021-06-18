const express = require('express');
const path = require('path');
const db = require('./db');
const collec = 'todo';

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

/* Controllers */
// get all tasks
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(collec);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
	console.log('Found the following records');
	console.log(docs);
	callback(docs);
  });
};

//create a task
const insertDocuments = function(db, callback, req) {
	const todo = req.body;
  // Get the documents collection
  const collection = db.collection(collec);
  // Insert some documents
  	collection.insertOne({ todo }, function(err, result) {
    console.log('Inserted task into the collection');
    callback(result);
  });
};

//find one task
const findOneDocuments = function(db, callback, req) {
	const todoID = req.params.id;

  // Get the documents collection
  const collection = db.getDB().collection(collec);
  // Find one specific documents
  collection.findOne({ _id:  db.getID(todoID)},(function(err, doc) {
    console.log('Found the following record');
    console.log(doc);
    callback(doc);
  }));
};

//update a task
const updateDocuments = function(db, callback, req) {
	const todoID = req.params.id;
	const todo = req.body;
  // Get the documents collection
  const collection = db.getDB().collection(collec);
  // Find some documents and update it
  collection.update({ _id:  db.getID(todoID)}, {...todo}, (function(err, doc) {
    console.log('Update the following record');
    console.log(doc);
    callback(doc);
  }));
};

//delete a task
const deleteDocument = function(db, callback, req) {
	const todoID = req.params.id;
  // Get the documents collection
  const collection = db.getDB().collection(collec);
  // Find one documents and delete it
  collection.findOneAndDelete({ _id:  db.getID(todoID)}, (function(err, doc) {
    console.log('Delete the following record');
    console.log(doc);
    callback(doc);
  }));
};


app.get('/api/task', (req, res) => {
	findDocuments(db.getDB(), (tasks) => {
		if(tasks.length == 0) {
			return res.status(200).json({message: 'No data in the database yet'})
		}
		res.status(200).json(tasks)
	})
})

app.post('/api/task', (req, res) => {
	insertDocuments(db.getDB(), (result) => {
		res.status(201).json(result);
	}, req)
})

app.get('/api/task/:id', (req, res) => {
	findOneDocuments(db, (result) => {
		res.status(200).json(result);
	}, req)
})

app.put('/api/task/:id', (req, res) => {
	updateDocuments(db, (result => {
		res.status(201).json(result)
	}), req)
})

app.delete('/api/task/:id', (req, res) => {
	deleteDocument(db, (result => {
		res.status(200).json()
	}), req)
})


module.exports = app;