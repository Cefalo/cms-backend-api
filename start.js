const mongoose = require('mongoose');

const [major, minor] = process.versions.node.split('.').map(parseFloat);

if (major < 12 || (major === 12 && minor <= 10)) {
	console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
	process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({
	path: 'variables.env'
});

// connect to our database and handle bad connection
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.Promise = global.Promise; //tell mongoose to use es6 promise
mongoose.connection.on('error', (error) => {
	console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () =>{
	console.log(`Express running → PORT ${server.address().port}`);
});