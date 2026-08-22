-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "assignedDAId" TEXT,
ADD COLUMN     "assignedPatwariId" TEXT,
ADD COLUMN     "assignedTehsildarId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_assignedDAId_fkey" FOREIGN KEY ("assignedDAId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_assignedPatwariId_fkey" FOREIGN KEY ("assignedPatwariId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_assignedTehsildarId_fkey" FOREIGN KEY ("assignedTehsildarId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
