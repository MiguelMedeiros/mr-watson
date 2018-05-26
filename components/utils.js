// *********************************************
// Utils Functions
// *********************************************

var express = require('express');
var dateFormat = require('dateformat');
var pjson = require('./../package.json');
var colors = require('colors');
var beeper = require('beeper');
var fs = require('fs');

var numberToReal = function(number) {
	number = parseFloat(number).toFixed(2).split('.');
	number[0] = "R$ " + number[0].split(/(?=(?:...)*$)/).join('.');
	return number.join(',');
};

var consoleLog = function(text, color = 'cyan'){
	if(color === "cyan"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".cyan.bold+" "+text);
		console.log("**********************************************************".cyan.strikethrough);
	}else if(color === "red"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".red.bold+" "+text);
		console.log("**********************************************************".red.strikethrough);
	}else if(color === "yellow"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".yellow.bold+" "+text);
		console.log("**********************************************************".yellow.strikethrough);
	}else if(color === "green"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".green.bold+" "+text);
		console.log("**********************************************************".green.strikethrough);
	}else if(color === "pink"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".magenta+" "+text);
		console.log("**********************************************************".magenta.strikethrough);
	}else if(color === "black"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".black+" "+text);
		console.log("**********************************************************".black.strikethrough);
	}
};

var saveLog = function(str){
	fs.appendFile('log.txt', str + "\n", function (err) {
		if (err) {
			// append failed
		} else {
			// done
		}
	});
};

var wakeUp = function(){
	// Wake Up Holmes!
	//this.cleanConsole();
	console.log("Name:",pjson.name);
	console.log("Description:",pjson.description);
	console.log("Version:",pjson.version);
	console.log("**********************************************************".yellow.strikethrough);
	console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".yellow.bold+" Hello, sir! I'm at your service!");
	console.log("**********************************************************".yellow.strikethrough);
};

var cleanConsole = function(){
	process.stdout.write('\x1Bc'); 
};
var unhandledRejection = function(){
	process.on('unhandledRejection', (reason, p) => {
		console.log("**********************************************************".red.strikethrough);
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".red.bold+"Unhandled Rejection at: Promise", p, "reason:", reason);
		console.log("**********************************************************".red.strikethrough);
	});
};
var beep = function(){
    beeper();
};

var switchOrderRejection = function(s) {
    switch(s) {
        case '0':
        	return "Broker / Exchange option";
        case '1':
        	return " Unknown symbol";
        case '2':
        	return "Exchange closed";
        case '3':
        	return "Order exceeds limit";
        case '4':
        	return "Too late to enter";
        case '5':
        	return "Unknown Order";
        case '6':
        	return "Duplicate Order";
        case '7':
        	return "Duplicate of a verbally communicated order";
        case '8':
        	return "Stale Order";
        case '9':
        	return "Trade Along required";
        case '10':
        	return "Invalid Investor ID";
        case '11':
        	return "Unsupported order characteristic";
        case '12':
        	return "Surveillence Option";
    }
};


// Export Functions
module.exports = {
	numberToReal: numberToReal,
	consoleLog: consoleLog,
	saveLog: saveLog,
	wakeUp: wakeUp,
	cleanConsole: cleanConsole,
	unhandledRejection: unhandledRejection,
	beep: beep,
	switchOrderRejection: switchOrderRejection
};
