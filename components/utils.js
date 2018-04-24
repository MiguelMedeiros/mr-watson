// *********************************************
// Utils Functions
// *********************************************

var express = require('express');
var dateFormat = require('dateformat');
var pjson = require('./../package.json');
var colors = require('colors');
var beeper = require('beeper');
var fs = require('fs');

var numberToReal = function(numero) {
	var numero = parseFloat(numero).toFixed(2).split('.');
	numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
	return numero.join(',');
}

var consoleLog = function(text, color = 'cyan'){
	if(color == "cyan"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".cyan.bold+" "+text);
		console.log("**********************************************************".cyan.strikethrough);
	}else if(color == "red"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".red.bold+" "+text);
		console.log("**********************************************************".red.strikethrough);
	}else if(color == "yellow"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".yellow.bold+" "+text);
		console.log("**********************************************************".yellow.strikethrough);
	}else if(color == "green"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".green.bold+" "+text);
		console.log("**********************************************************".green.strikethrough);
	}else if(color == "pink"){
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".magenta+" "+text);
		console.log("**********************************************************".magenta.strikethrough);
	}
}

var saveLog = function(str){
	fs.appendFile('log.txt', str + "\n", function (err) {
		if (err) {
			// append failed
		} else {
			// done
		}
	});
}

var wakeUp = function(){
	// Wake Up Holmes!
	this.cleanConsole();
	console.log("Name:",pjson.name);
	console.log("Description:",pjson.description);
	console.log("Version:",pjson.version);
	console.log("**********************************************************".yellow.strikethrough);
	console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".yellow.bold+" Hello, sir! I'm at your service!");
	console.log("**********************************************************".yellow.strikethrough);
}

var cleanConsole = function(){
	process.stdout.write('\x1Bc'); 
}
var unhandledRejection = function(){
	process.on('unhandledRejection', (reason, p) => {
		console.log("**********************************************************".red.strikethrough);
		console.log("-> "+dateFormat(new Date(), "h:MM:ss")+" [Mr. Watson]".red.bold+"Unhandled Rejection at: Promise", p, "reason:", reason);
		console.log("**********************************************************".red.strikethrough);
	});
}
var beep = function(){
    beeper();
}

// Export Functions
module.exports = {
	numberToReal: numberToReal,
	consoleLog: consoleLog,
	saveLog: saveLog,
	wakeUp: wakeUp,
	cleanConsole: cleanConsole,
	unhandledRejection: unhandledRejection,
	beep: beep
}
