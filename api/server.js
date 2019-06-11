const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  name: "monkey",  // rename cookie for security so cannot tell which cookie library using
  secret: "keep it secret, keep it safe!", // encryption
  resave: false, // if there are no changes to the session don't save again
  saveUninitialized: true,  // for GDPR compliance
  cookie: {
    maxAge: 1000 * 60 * 10, // = 10 min in milliseconds
    secure: false, // send cookie only over HTTPS, set to true in production
    httpOnly: true, //always set to true, it means client JS can't access the cookie
  },
  store: new KnexSessionStore({
    knex: require('../database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30 // = 30 minutes
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
