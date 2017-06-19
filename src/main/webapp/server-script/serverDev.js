var path = require('path');
var express = require('express');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./sales/webpack.config.js');
var configB = require('./operation/webpack.config.js');
var methodOverride = require('method-override');
var app = express();
var compiler = webpack(config);
var fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser');
var appLog = express();

appLog.use(cors())
appLog.use(methodOverride());
appLog.use(bodyParser.json());
appLog.use(bodyParser.urlencoded({ extended: true }));

var corsOptions = [{
  origin: 'http://localhost:8182', //log service will get request from this URL
  optionsSuccessStatus: 200
},{
  origin: 'http://localhost:8183', //log service will get request from this URL
  optionsSuccessStatus: 200
}]

appLog.post('/', cors(corsOptions), (req, res) => {
	fs.appendFile('d:/logfile.log', req.body.data, (err) => {
  if (err) { console.log('Error while appending logs!'); } });
  res.send('');
});

appLog.listen(8184);
console.log('logging: Listening at http://localhost:8184');

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo : true,
	publicPath : config.output.publicPath
}));
//app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static('sales'));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, './sales/index.html'));
});
app.listen(8182, '0.0.0.0', function(err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('sales: Listening at http://localhost:8182');
});
var ap = express();
var compiler = webpack(configB);

ap.use(require('webpack-dev-middleware')(compiler, {
	noInfo : true,
	publicPath : config.output.publicPath
}));

//ap.use(require("webpack-hot-middleware")(compiler));
ap.use(express.static('operation'));
ap.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './operation/index.html'));
});

ap.listen(8183, '0.0.0.0', function(err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Operation: Listening at http://localhost:8183');
});
