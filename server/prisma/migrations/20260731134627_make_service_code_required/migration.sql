/*
  Warnings:

  - Made the column `code` on table `CertificateService` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."CertificateService" ALTER COLUMN "code" SET NOT NULL;
