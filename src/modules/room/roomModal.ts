import { MessageSchema } from '@modules/message/messageModel';
import { z } from 'zod';

export type TypeRoom = z.infer<typeof RoomSchema>;
export const RoomSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
    roomeName: z.string(),
    student: z.array(z.string().uuid()),
    messages: MessageSchema,
    createdBy: z.string().uuid(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().nullable(),
  }),
});

export type TypeCreateRoom = z.infer<typeof CreateRoomSchema>;
export const CreateRoomSchema = z.object({
  body: z.object({
    roomName: z.string(),
  }),
});

export const GetRoomParamsSchema = z.object({
  params: z.object({ page: z.string(), size: z.string() }),
});

export type TypeGetRoomById = z.infer<typeof RoomByIdSchema>;
export const RoomByIdSchema = z.object({
  params: z.object({
    roomId: z.string().uuid(),
  }),
});
