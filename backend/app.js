const express = require('express');
const path = require('path');
const db = require('./db');
const collec = 'todo';

const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

/* Controllers */
const findDocuments = function(db, callback) {
  const collection = db.collection(collec);
  collection.find({}).toArray()
  .then(tasks => {
	console.log('Found the following records');
	console.log(tasks);
	callback(tasks);
  })
  .catch(err => console.log(err))
};


const insertDocuments = function(db, callback, req) {
	const todo = req.body;
	console.log(todo)
  	const collection = db.collection(collec);
  	collection.insertOne({ ...todo })
	.then((result) => {
		console.log('Inserted task into the collection');
		callback({result: result.ops[0]});
	  })
	.catch(err => console.log(err))
};


const findOneDocuments = function(db, callback, req) {
	const todoID = req.params.id;
  const collection = db.getDB().collection(collec);
  collection.findOne({ _id:  db.getID(todoID)})
  .then((task) => {
	console.log('Found the following record');
	console.log(task);
	callback(task);
  })
  .catch()
};


const updateDocuments = function(db, callback, req) {
	const todoID = req.params.id;
	const todo = req.body;
  const collection = db.getDB().collection(collec);
  collection.update({ _id:  db.getID(todoID)}, {...todo})
  .then((updatedTask) => {
    console.log('Update the following record');
    console.log(updatedTask);
    callback(updatedTask);
  })
  .catch(err => console.log(err))
};


const deleteDocument = function(db, callback, req) {
	const todoID = req.params.id;
  const collection = db.getDB().collection(collec);
  collection.remove({ _id:  db.getID(todoID)})
  .then((deletedTask) => {
    console.log('Delete the following record');
    console.log(deletedTask);
    callback(deletedTask);
  })
};


/* routes */
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