const { prompt } = require('inquirer');

var readline = require('readline');
var dictApis = require('./dictApis.js');
var ROUTES = require(__dirname + '/routes/routes')


var userInput = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: 'RES> '
});

console.log("Please press ./dict help to know various commands.")

userInput.on('line', (line) => {
  // calling routes
  ROUTES(line.trim());
  // reset prompt marker to new line
  userInput.prompt();
});

userInput.on('SIGINT', () => {
  userInput.question('Are you sure you want to exit the tool? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) userInput.pause();
  });

});