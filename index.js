const mongoose = require('mongoose');
const util = require('util');

const { server } = require('./config/socket');

// config should be imported before importing any other file
const config = require('./config/env');

const debug = require('debug')('hi-chat:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {
  keepAlive: 1,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

//opens a port if the environment is not test
if (process.env.NODE_ENV !== 'test') {
  // listen on port config.port
  server.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}
