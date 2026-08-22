-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'DRAFT';

-- Commit so PostgreSQL can use the new enum value
COMMIT;

-- AlterTable
ALTER TABLE "Application"
ALTER COLUMN "applicationNumber" DROP NOT NULL,
ALTER COLUMN "currentStage" DROP NOT NULL,
ALTER COLUMN "currentStage" DROP DEFAULT;

ALTER TABLE "Application"
ALTER COLUMN "status" SET DEFAULT 'DRAFT';