/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ApplicationDocument` table. All the data in the column will be lost.
  - Added the required column `fileSize` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApplicationDocument" DROP COLUMN "createdAt",
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
