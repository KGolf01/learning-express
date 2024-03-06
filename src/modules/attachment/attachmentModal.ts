import { z } from "zod";
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CreateAttachmentSchema = z.object({
  body: z.object({
    file: z
      .custom<FileList>()
      .transform((file) => file?.length > 0 && file?.item(0))
      .refine((file) => !file || (!!file && file?.size <= 10 * 1024 * 1024), {
        message: "The profile picture must be a maximum of 10MB.",
      })
      .refine((file) => !file || (!!file && file?.type?.startsWith("image")), {
        message: "Only images are allowed to be sent.",
      }),
    UserID: z.string().uuid(),
  }),
});
