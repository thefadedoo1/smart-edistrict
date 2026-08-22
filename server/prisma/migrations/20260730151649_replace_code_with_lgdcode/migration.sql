/*
  Warnings:

  - You are about to drop the column `code` on the `District` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Tehsil` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Village` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lgdCode]` on the table `District` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lgdCode]` on the table `Tehsil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[districtId,name]` on the table `Tehsil` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lgdCode]` on the table `Village` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tehsilId,name]` on the table `Village` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lgdCode` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lgdCode` to the `Tehsil` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lgdCode` to the `Village` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."District_code_key";

-- DropIndex
DROP INDEX "public"."Tehsil_code_key";

-- DropIndex
DROP INDEX "public"."Village_code_key";

-- AlterTable
ALTER TABLE "public"."District" DROP COLUMN "code",
ADD COLUMN     "lgdCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tehsil" DROP COLUMN "code",
ADD COLUMN     "lgdCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Village" DROP COLUMN "code",
ADD COLUMN     "lgdCode" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "District_lgdCode_key" ON "public"."District"("lgdCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tehsil_lgdCode_key" ON "public"."Tehsil"("lgdCode");

-- CreateIndex
CREATE INDEX "Tehsil_districtId_idx" ON "public"."Tehsil"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Tehsil_districtId_name_key" ON "public"."Tehsil"("districtId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Village_lgdCode_key" ON "public"."Village"("lgdCode");

-- CreateIndex
CREATE INDEX "Village_tehsilId_idx" ON "public"."Village"("tehsilId");

-- CreateIndex
CREATE UNIQUE INDEX "Village_tehsilId_name_key" ON "public"."Village"("tehsilId", "name");
