/*
  Warnings:

  - A unique constraint covering the columns `[certificateNumber]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "certificateNumber" TEXT,
ADD COLUMN     "certificateUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Application_certificateNumber_key" ON "public"."Application"("certificateNumber");
