-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('SMS', 'FEED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('AD', 'LOCAL');

-- CreateTable
CREATE TABLE "User" (
    "UserID" UUID NOT NULL,
    "FW_USER_ID" TEXT NOT NULL,
    "Username" VARCHAR(255),
    "Email" VARCHAR(255),
    "Password" VARCHAR(255),
    "FirstName" VARCHAR(255) NOT NULL DEFAULT 'member',
    "LastName" VARCHAR(255),
    "Tel" VARCHAR(20),
    "Role" SMALLINT NOT NULL,
    "UserType" "UserType" NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Token" (
    "ID" UUID NOT NULL,
    "Type" "TokenType" NOT NULL,
    "IP" VARCHAR(50),
    "Device" VARCHAR(255),
    "Latitude" VARCHAR(100),
    "Longitude" VARCHAR(100),
    "Token" TEXT NOT NULL,
    "RefreshToken" TEXT,
    "Expiration" TIMESTAMP(3) NOT NULL,
    "ExpirationRefreshToken" TIMESTAMP(3),
    "CreatedBy" UUID,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "UserLog" (
    "LogID" UUID NOT NULL,
    "Action" VARCHAR(255) NOT NULL,
    "Message" TEXT NOT NULL,
    "MessageOld" TEXT,
    "CreatedBy" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("LogID")
);

-- CreateTable
CREATE TABLE "SMS" (
    "SMSID" UUID NOT NULL,
    "Sender" TEXT NOT NULL,
    "To" TEXT NOT NULL,
    "Contact" TEXT,
    "ScheduleDate" TEXT,
    "Option" "OptionType" NOT NULL DEFAULT 'SMS',
    "MessageText" TEXT NOT NULL,
    "Characters" INTEGER NOT NULL,
    "Result" JSONB,
    "CreatedBy" UUID NOT NULL,
    "Remove" BOOLEAN NOT NULL DEFAULT false,
    "Destroy" TIMESTAMP(3),
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SMS_pkey" PRIMARY KEY ("SMSID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_Token_key" ON "Token"("Token");

-- CreateIndex
CREATE UNIQUE INDEX "Token_RefreshToken_key" ON "Token"("RefreshToken");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMS" ADD CONSTRAINT "SMS_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
