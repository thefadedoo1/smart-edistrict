-- CreateTable
CREATE TABLE "public"."RequiredDocument" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 1,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequiredDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequiredDocument_serviceId_idx" ON "public"."RequiredDocument"("serviceId");

-- AddForeignKey
ALTER TABLE "public"."RequiredDocument" ADD CONSTRAINT "RequiredDocument_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."CertificateService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
