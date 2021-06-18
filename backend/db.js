const { MongoClient, ObjectID } = require('mongodb');
require('dotenv').config();

const dbName = 'todoAPP';
const url = process.env.CONNECTIONSTRING;
const mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

const state = {db: null}
const connect = (cb) => {
	if(state.db) {
		cb()
	} else {
		MongoClient.connect(url, mongoOptions, (err, client) => {
			if(err) {
				cb(err);
				return;
			}
			
			state.db = client.db(dbName);
			cb();
		})
	}
}

const getDB = () => {
	return state.db;
}

const getID = (_id) => {
	return ObjectID(_id);
}

module.exports = {connect, getDB, getID}