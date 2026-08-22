-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "public"."CitizenProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aadhaarNumber" TEXT,
    "gender" "public"."Gender",
    "dateOfBirth" TIMESTAMP(3),
    "fatherName" TEXT,
    "motherName" TEXT,
    "address" TEXT,
    "pincode" TEXT,
    "districtId" TEXT,
    "tehsilId" TEXT,
    "villageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitizenProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CitizenProfile_userId_key" ON "public"."CitizenProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CitizenProfile_aadhaarNumber_key" ON "public"."CitizenProfile"("aadhaarNumber");

-- AddForeignKey
ALTER TABLE "public"."CitizenProfile" ADD CONSTRAINT "CitizenProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CitizenProfile" ADD CONSTRAINT "CitizenProfile_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CitizenProfile" ADD CONSTRAINT "CitizenProfile_tehsilId_fkey" FOREIGN KEY ("tehsilId") REFERENCES "public"."Tehsil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CitizenProfile" ADD CONSTRAINT "CitizenProfile_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "public"."Village"("id") ON DELETE SET NULL ON UPDATE CASCADE;
