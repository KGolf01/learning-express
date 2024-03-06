import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { logger } from "@src/server";
import { StatusCodes } from "http-status-codes";
import { attachmentRepository } from "./attachmentRepository";
import { Request } from "express";
import { userRepository } from "@modules/user/userRepository";

export const attachmentService = {
  createFIle: async (req: Request) => {
    try {
      const user = await userRepository.findByIdAsync(req.body.UserID);
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      const attachment = await attachmentRepository.createFile(req);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Create file attachment success",
        attachment,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error Create file attachment :, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },
};
