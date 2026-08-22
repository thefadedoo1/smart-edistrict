/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `CertificateService` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."CertificateService" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CertificateService_code_key" ON "public"."CertificateService"("code");
