/*
  Warnings:

  - You are about to drop the column `documentName` on the `ApplicationDocument` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationId,requiredDocumentId]` on the table `ApplicationDocument` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalFileName` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredDocumentId` to the `ApplicationDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApplicationDocument" DROP COLUMN "documentName",
ADD COLUMN     "originalFileName" TEXT NOT NULL,
ADD COLUMN     "requiredDocumentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ApplicationDocument_applicationId_idx" ON "public"."ApplicationDocument"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationDocument_requiredDocumentId_idx" ON "public"."ApplicationDocument"("requiredDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationDocument_applicationId_requiredDocumentId_key" ON "public"."ApplicationDocument"("applicationId", "requiredDocumentId");

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_requiredDocumentId_fkey" FOREIGN KEY ("requiredDocumentId") REFERENCES "public"."RequiredDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
