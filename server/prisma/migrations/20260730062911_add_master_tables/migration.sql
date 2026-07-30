-- CreateTable
CREATE TABLE "public"."District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tehsil" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tehsil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Village" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tehsilId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "public"."District"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_code_key" ON "public"."District"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tehsil_code_key" ON "public"."Tehsil"("code");

-- AddForeignKey
ALTER TABLE "public"."Tehsil" ADD CONSTRAINT "Tehsil_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Village" ADD CONSTRAINT "Village_tehsilId_fkey" FOREIGN KEY ("tehsilId") REFERENCES "public"."Tehsil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
