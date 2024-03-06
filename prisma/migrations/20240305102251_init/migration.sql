-- CreateTable
CREATE TABLE "Attachment" (
    "AttachmentID" UUID NOT NULL,
    "UserID" UUID NOT NULL,
    "FileKey" VARCHAR(255) NOT NULL,
    "FileName" VARCHAR(255) NOT NULL,
    "FileSize" VARCHAR(255) NOT NULL,
    "Extension" VARCHAR(255) NOT NULL,
    "Mimetype" VARCHAR(255),
    "FullPath" TEXT,
    "Type" TEXT NOT NULL,
    "CreatedBy" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("AttachmentID")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
