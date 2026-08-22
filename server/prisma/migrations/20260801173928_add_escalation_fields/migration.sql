-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "escalatedAt" TIMESTAMP(3),
ADD COLUMN     "isEscalated" BOOLEAN NOT NULL DEFAULT false;
