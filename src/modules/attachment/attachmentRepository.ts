import { Request } from "express";
import prisma from "../../db";
import mime from "mime";

export const attachmentRepository = {
  createFile: async (req: Request) => {
    const body = req.body;
    const payload: any = {
      UserID: body.UserID,
      FileKey: req.file?.filename,
      FileName: req.file?.originalname,
      FileSize: req.file?.size?.toString() ?? "unknown",
      Extension: req.file?.mimetype
        ? mime.extension(req.file.mimetype)
        : "unknown",
      Mimetype: req.file?.mimetype,
      FullPath: req.file?.path ?? null,
      CreatedBy: body.UserID,
    };
    return await prisma.$transaction(async function (tx) {
      const Attachment = await tx.attachment.create({
        data: payload,
      });
      return Attachment;
    });
  },
};
