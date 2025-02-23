require("dotenv").config();
require('newrelic');
const express = require("express");
const newrelic = require('newrelic');
const winston = require('winston');



// configure winston logger in newrelic
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    require('@newrelic/winston-enricher')(winston.format)()
  ),
  transports: [
    new winston.transports.Console(),
    new NewRelicApiTransport()
  ]
});

const app = express();
const PORT = process.env.PORT || 8888;

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`, { route: req.path });
    next();
});

app.get('/', (req, res) => {
logger.info('Home route accessed');
    res.send("Server has started.");
});

app.get("/success", (req, res) => {
    try {
        res.send("hello success!!")
    } catch (error) {
         newrelic.noticeError(new Error(error));
    }
 })

 app.get("/slow-success", (req, res) => {
    try {
     setTimeout(() => {
         res.send("hello slow success!!")
     }, 5000);
    } catch (error) {
        newrelic.noticeError(new Error(error));
    }
 })


app.get("/error", (req, res) => {
   try {
    throw new Error("add custom attribute error!")
} catch (error) {
    logger.error('Error occurred:', error);
    newrelic.noticeError(error, {
        userId: req.headers['x-user-id'] || 'unknown',
        route: req.path,
        critical: true,
        prevData: 'this is prev data array'
    });
    res.status(500).send(error)
   }
})

app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});