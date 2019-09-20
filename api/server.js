const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');
const db = require('../database/dbConfig.js');

const KnexSessionStore = connectSessionKnex(session);
const server = express();

const sessionConfig = {
        name: 'trackpad life',
        secret: 'monsoon demons are messing with my gutters',
        cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true // the cant access via js
        },
resave: false,
saveUninitialized: false,
// where do we store our sessions?
store: new KnexSessionStore({
  knex: db,
  tablename: 'sessions',
  sidfieldname: 'sid',
  createtable: true,
  clearInterval: 1000 * 60 * 60
})
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', (req, res) => {
res.json({ api: 'up' });
});

module.exports = server; 
