/*
  Warnings:

  - A unique constraint covering the columns `[serviceId,name]` on the table `RequiredDocument` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RequiredDocument_serviceId_name_key" ON "public"."RequiredDocument"("serviceId", "name");
