const express = require('express');
const morgan = require('morgan');
const fs = require('fs')
const { connect } = require('mongoose')
const {success, error, info, log} = require('consola');

//Bring the app constants
const {DB, PORT} = require('./src/config/application');

//Initialize the application
const app = express();

//Middleware
app.use(morgan('tiny'));
app.use(express.json());
require('./src/config/passport')(app);

app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        error({message:err, badge:true})
        return res.status(400).json({message:err.message})
    }else{
        next();
    } 
    
  });


//Router middleware
app.use('/api/user', require('./src/routes/users'));

let retryAttemptCount = 5;
const startApp = async function(){
    try{
        //DB connection
        info({
            message:'Trying to connect to the Database....',
            badge:true
        })
        
        await connect(DB, {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useFindAndModify: true
        })

        info({
            message:`Successfully conneted to the Database \n${DB}`,
            badge: true
        });
        
        //Start to listen the port
        app.listen(PORT, () => {
            log({
                message:`Server started and listening on PORT: ${PORT}`,
                badge:true
            })
        });

    }catch(err){
        error({
            message:`Unable to connect to Database /n${DB}\n${err}`
        });

        while(retryAttemptCount > 0){
            --retryAttemptCount;
            startApp();
        }
        
    }
    
}

startApp()


app.get('/', (req, res) => {
    res.send('Hello CMS!')
});


