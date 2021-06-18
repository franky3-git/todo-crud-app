const port = process.env.PORT || 3000;
const app = require('./app');
const http = require('http');
const db = require('./db');


const server = http.createServer(app)


db.connect((err) => {
	if(err) {
		console.log('unable to connect to the database')
		process.exit(1);
	} else {
		console.log('Connected to database')
		server.listen(port, (err) => {
			if(err) console.log(err)
			console.log('http://localhost:' + port)
		})
	}
})

