import express from "express";
import helmet from "helmet";
import cors from "cors";
import { pino } from "pino";

import { env } from "@common/utils/envConfig";
import rateLimiter from "@common/middleware/rateLimiter";
import errorHandler from "@common/middleware/errorHandler";
import { userRouter } from "@modules/user/userRouter";
import { openAPIRouter } from "@api-docs/openAPIRouter";
import { authRouter } from "@modules/auth/authRouter";
import { attachmentRouter } from "@modules/attachment/attachmentRouter";
import { initializeRedisClient } from "@common/middleware/redis";

const logger = pino({ name: "server start" });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Redis
initializeRedisClient();

// Routes
app.use("/v1/user", userRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/attachment", attachmentRouter);

// Swagger UI
app.use(openAPIRouter);

// test
app.use("/test", (req, res) => {
  return res.json("Hello world!");
});

// Error handlers
app.use(errorHandler());

export { app, logger };
