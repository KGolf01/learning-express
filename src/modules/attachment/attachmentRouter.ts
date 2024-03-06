import authenticateToken from "@common/middleware/authenticateToken";
import {
  handleServiceResponse,
  validateRequest,
} from "@common/utils/httpHandlers";
import express, { Router, Request, Response } from "express";
import { CreateAttachmentSchema } from "./attachmentModal";
import { attachmentService } from "./attachmentService";

import { upload } from "@common/utils/uploadFile";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@api-docs/openAPIResponseBuilders";

export const attachmentRegistry = new OpenAPIRegistry();

attachmentRegistry.register("Attachment", CreateAttachmentSchema);

export const attachmentRouter: Router = (() => {
  const router = express.Router();

  
  const bearerAuth = attachmentRegistry.registerComponent(
    "securitySchemes",
    "bearerAuth",
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    }
  );

  attachmentRegistry.registerPath({
    method: "post",
    path: "/v1/attachment/upload",
    tags: ["Attachment"],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: CreateAttachmentSchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(CreateAttachmentSchema, "Success"),
  });

  router.post(
    "/upload",
    authenticateToken,
    // validateRequest(CreateAttachmentSchema),
    upload.single("file"),
    async (req: Request, res: Response) => {
      const serviceResponse = await attachmentService.createFIle(req);
      handleServiceResponse(serviceResponse, res);
    }
  );
  return router;
})();
