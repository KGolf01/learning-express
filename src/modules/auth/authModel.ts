import { z } from "zod";

export enum LoginType {
  LOCAL = "LOCAL",
  AD = "AD",
}

export type TypeLoginSchema = z.infer<typeof LoginSchema>;
export type TypePayloadLogin = {
  Email?: string;
  Username: string;
  Password: string;
  LoginType: LoginType;
};
export const LoginSchema = z.object({
  body: z.object({
    Email: z.string().email().optional(),
    Username: z.string(),
    Password: z.string(),
    LoginType: z.nativeEnum(LoginType),
  }),
});
