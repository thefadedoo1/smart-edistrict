-- CreateEnum
CREATE TYPE "public"."FormFieldType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'TEXTAREA', 'SELECT', 'RADIO', 'CHECKBOX');

-- DropForeignKey
ALTER TABLE "public"."ApplicationDocument" DROP CONSTRAINT "ApplicationDocument_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApplicationHistory" DROP CONSTRAINT "ApplicationHistory_applicationId_fkey";

-- CreateTable
CREATE TABLE "public"."ServiceForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceFormField" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "fieldType" "public"."FormFieldType" NOT NULL,
    "placeholder" TEXT,
    "defaultValue" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL,
    "options" JSONB,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceFormField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceForm_serviceId_key" ON "public"."ServiceForm"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceForm_serviceId_idx" ON "public"."ServiceForm"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceFormField_formId_idx" ON "public"."ServiceFormField"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceFormField_formId_fieldKey_key" ON "public"."ServiceFormField"("formId", "fieldKey");

-- AddForeignKey
ALTER TABLE "public"."ServiceForm" ADD CONSTRAINT "ServiceForm_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."CertificateService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceFormField" ADD CONSTRAINT "ServiceFormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."ServiceForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationHistory" ADD CONSTRAINT "ApplicationHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
