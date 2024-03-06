import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@common/utils/commonValidation";

extendZodWithOpenApi(z);

export const UserType = z.enum(["AD", "LOCAL"]).optional();

const TokenType = z.enum([
  "ACCESS",
  "REFRESH",
  "RESET_PASSWORD",
  "VERIFY_EMAIL",
]);

const OptionType = z.enum(["SMS", "FEED"]); // แก้ SMS เป็นค่าที่เหมาะสม

export type TypeToken = z.infer<typeof TokenSchema>;
export const TokenSchema = z.object({
  ID: z.string().uuid(),
  Type: TokenType,
  IP: z.string().max(50).optional(),
  Device: z.string().max(255).optional(),
  Latitude: z.string().max(100).optional(),
  Longitude: z.string().max(100).optional(),
  Token: z.string(),
  RefreshToken: z.string().nullable(),
  Expiration: z.date(),
  ExpirationRefreshToken: z.date().nullable(),
  CreatedBy: z.string().uuid().nullable(),
  CreatedAt: z.date().default(() => new Date()),
  UpdatedAt: z.date().nullable(),
});

export type TypeSMS = z.infer<typeof SMSSchema>;
export const SMSSchema = z.object({
  SMSID: z.string().uuid(),
  Sender: z.string(),
  To: z.string(),
  Contact: z.string().optional(),
  ScheduleDate: z.string().optional(),
  Option: OptionType.default("SMS"),
  MessageText: z.string(),
  Characters: z.number().int(),
  Result: z.any().nullable(), // ปรับตามลักษณะของข้อมูล Result
  CreatedBy: z.string().uuid(),
  Remove: z.boolean().default(false),
  Destroy: z.date().nullable(),
  CreatedAt: z.date().default(() => new Date()),
  UpdatedAt: z.date().nullable(),
});

export type TypeUser = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  UserID: z.string().uuid(),
  FW_USER_ID: z.string(),
  Username: z.string().optional(),
  Email: z.string().email().optional(),
  Password: z.string().optional(),
  FirstName: z.string().default("member"),
  LastName: z.string().optional(),
  Tel: z.string().max(20).optional(),
  Role: z.number().int(),
  UserType: UserType,
  CreatedAt: z.date().default(() => new Date()),
  UpdatedAt: z.date().nullable(),
  Token: z.array(TokenSchema),
  SMS: z.array(SMSSchema),
});

// Input Validation for 'GET users/:UserID' endpoint
export const GetUserSchema = z.object({
  params: z.object({ UserID: commonValidations.uuid }),
});

export type TypeUpdateUser = z.infer<typeof UpdateUserSchema>;
export const UpdateUserSchema = z.object({
  body: z.object({
    UserID: z.string().uuid(),
    Email: z.string().email().optional(),
    Password: z.string().optional(),
    FirstName: z.string().optional(),
    LastName: z.string().optional(),
    Tel: z.string().max(20).optional(),
    UserType: UserType,
  }),
});

export type TypeCreateUser = z.infer<typeof CreateUserSchema>;
export type TypePayloadUser = {
  Email: string;
  Username: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Tel: string;
  UserType: "AD" | "LOCAL";
};
export const CreateUserSchema = z.object({
  body: z.object({
    Email: z.string().email(),
    Username: z.string(),
    Password: z.string(),
    FirstName: z.string(),
    LastName: z.string(),
    Tel: z.string().max(20).optional(),
    UserType: UserType,
  }),
});
