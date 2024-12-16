import { createServer } from 'http';
import express from 'express';
import bodyParser from 'body-parser'; // Import the default export
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { Server as Socketio } from 'socket.io'; // Use named export

import { info } from './helpers/log.js';
import routes from './routes/index.js';
import firebase from './firebase/index.js';
import socketConnectionHandler from './sockets/index.js';

const PORT = 3030;

const app = express();
const server = createServer(app);

// Hey you! care about my order http://stackoverflow.com/a/16781554/2034015

// Firebase stuff.
firebase.start();

// Cookies.
app.use(cookieParser());

// Body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging.
app.use(morgan('dev'));

// Routes.
app.use('/', routes);

// Socket.io
const io = new Socketio(server);
io.on('connection', socketConnectionHandler);

server.listen(PORT, () => {
  info(`Server is running on port ${PORT}`);
});