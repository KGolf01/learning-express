import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pino } from 'pino';
import { Server } from 'socket.io';
import http from 'http';

import { env } from '@common/utils/envConfig';
import rateLimiter from '@common/middleware/rateLimiter';
import errorHandler from '@common/middleware/errorHandler';
import { userRouter } from '@modules/user/userRouter';
import { openAPIRouter } from '@api-docs/openAPIRouter';
import { authRouter } from '@modules/auth/authRouter';
import { attachmentRouter } from '@modules/attachment/attachmentRouter';
import { initializeRedisClient } from '@common/middleware/redis';
import { roomRouter } from '@modules/room/roomRouter';
import { messageRouter } from '@modules/message/messageRouter';
import axios from 'axios';
import { getMessageByRoomId } from '@common/utils/services/api.service';

const logger = pino({ name: 'server start' });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// Redis
initializeRedisClient();

// Routes
app.use('/v1/user', userRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/attachment', attachmentRouter);
app.use('/v1/room', roomRouter);
app.use('/v1/message', messageRouter);

// socket.io
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  const MAINURL = `http://${env.HOST}:${env.PORT}`;

  const config = {
    headers: {
      authorization: 'Bearer ' + socket.handshake.headers.authorization,
    },
  };
  socket.on('chat-message', async (message, callback) => {
    const payload = {
      roomId: message.roomId,
      content: message.content,
    };
    await axios.post(MAINURL + '/v1/message/create', payload, config).then(() => {
      // axios.get(MAINURL + '/v1/room/get' + `/${message.roomId}`, config).then((res) => {
      //   socket.broadcast.emit('chat-receive', res.data);
      // });

      getMessageByRoomId({
        config: config,
        roomId: message.roomId,
      }).then((res) => {
        socket.broadcast.emit('chat-receive', res.data);
        callback(res.data);
      });
    });
  });

  socket.on('connected-room', (message) => {
    getMessageByRoomId({
      config: config,
      roomId: message.roomId,
    }).then((res) => {
      socket.broadcast.emit('chat-receive', res.data);
    });
  });
});

// Swagger UI
app.use(openAPIRouter);

// test
app.use('/test', (req, res) => {
  return res.json('Hello world!');
});

// Error handlers
app.use(errorHandler());

export { server, logger };
