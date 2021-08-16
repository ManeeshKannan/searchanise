const redis = require("redis");
const dotenv = require('dotenv');

dotenv.config();

const port = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
}

const clint = redis.createClient(port);

clint.on("error", (error) => {
    console.log("redis Encounter" + error);
});

clint.on("connect", (error) => {
    console.log("redis connected SucessFully");
});

clint.on("ready", (error) => {
    console.log("client connected to redis and ready to use");
});

clint.on("end", (error) => {
    console.log("client disconnect the redis");
});

module.exports = clint;