const app = require('./app');
const config = require('./configs/app.config');
const port = config.port || 3000;

app.listen(port, () => {
    console.log(`CMS Engine started and listening port: ${port}`);
});