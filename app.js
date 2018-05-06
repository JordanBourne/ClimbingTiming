var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err.stack);
	res.status(500);
	res.json({code: 'UNCAUGHT_EXCEPTION', message: err});
});

app.listen(80, function() {
	console.log('hello world');
});
