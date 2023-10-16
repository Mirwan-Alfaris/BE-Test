const {createClient} = require('redis');

const redisClient = createClient({
  port: process.env.REDIS_PORT || '6379',
  host: process.env.REDIS_HOST || '127.0.0.1',
});

redisClient.connect();


module.exports = {
  redisClient,
};
