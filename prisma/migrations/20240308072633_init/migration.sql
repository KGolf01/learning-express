/*
  Warnings:

  - You are about to drop the column `UpdatedAt` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `_Room` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Room" DROP CONSTRAINT "_Room_A_fkey";

-- DropForeignKey
ALTER TABLE "_Room" DROP CONSTRAINT "_Room_B_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "UpdatedAt",
ADD COLUMN     "createdBy" UUID NOT NULL,
ADD COLUMN     "student" UUID[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_Room";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
