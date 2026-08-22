-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "stageDeadline" TIMESTAMP(3),
ADD COLUMN     "stageStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
