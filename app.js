var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

// Importing Custom Libs
var cron = require('node-cron');
var utils = require('./components/utils');
var blinktrade = require('./components/blinktrade');
var blockchainInfo = require('./components/blockchainInfo');
var variables = require('./variables');
var config = require('./config.json');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if(config.consoleLog){
	app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false, // true = .sass and false = .scss
	sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// adding Font-Awesome routes for fonts files
app.use('/fonts', express.static('./node_modules/font-awesome/fonts'));

// *********************************************
// Mr. Watson Starts here!
// *********************************************
app.listen(function () {
	// Start Watson
	if(config.key !== "" && config.password !== "" && config.secret !== ""){

		utils.wakeUp();              // Wake up Mr. Watson
		utils.unhandledRejection();  // Error Handlers
		blinktrade.listenChat();	 // Listen Telegram chat
		blinktrade.orderExecuted();  // Listen to Orders Executed
		blockchainInfo.wallets();  	 // Get Cold Wallets info

		// Refresh Wallets (Cron Tasks: 1 min clock)
		cron.schedule('*/1 * * * *', function(){
			blockchainInfo.wallets();
		});

		// Start Blinktrade Rest API (Cron Tasks: 2s clock)
		cron.schedule('*/2 * * * * *', function(){
			blinktrade.balance();
			blinktrade.ticker();
			blinktrade.myOrders();
			blinktrade.orderbook();
			blinktrade.requestLedger();
		});

		// Start Blinktrade WS (Cron Tasks: 5s clock)
		cron.schedule('*/5 * * * * *', function(){
			blinktrade.heartbeat();
			blinktrade.tradeHistory();
		});

		// Alert high and low prices (Cron Tasks: 5 mins clock)
		cron.schedule('*/5 * * * *', function(){
			blinktrade.alertPrice();
		});

	}else{
		//utils.cleanConsole();
		utils.consoleLog("Configuração incompleta, atualize seu arquivo config.json e tente novamente.", "red");
		process.exit();
	}
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;


