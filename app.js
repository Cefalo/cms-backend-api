const express = require('express');
const logger = require('morgan');
const fs = require('fs')
const { connect } = require('mongoose')
const {success, error, info, log} = require('consola');

//Bring the app constants
const {DB, PORT} = require('./config/application');

//Initialize the application
const app = express();

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


