-- CreateEnum
CREATE TYPE "public"."WorkflowAction" AS ENUM ('FORWARD', 'APPROVE', 'REJECT', 'CORRECTION_REQUIRED');

-- CreateTable
CREATE TABLE "public"."ApplicationHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "fromStage" "public"."WorkflowStage" NOT NULL,
    "toStage" "public"."WorkflowStage" NOT NULL,
    "action" "public"."WorkflowAction" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ApplicationHistory" ADD CONSTRAINT "ApplicationHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationHistory" ADD CONSTRAINT "ApplicationHistory_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
