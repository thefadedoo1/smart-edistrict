import { PrismaClient, Role, WorkflowStage, ApplicationStatus, WorkflowAction, Gender } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateCertificate } from "../../src/services/certificate.service";

export async function seedDemoData(prisma: PrismaClient) {
  console.log("🌟 Seeding Demo Accounts & Workflows...");

  const officerHash = await bcrypt.hash("Officer@123", 10);
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const citizenHash = await bcrypt.hash("Citizen@123", 10);

  // 1. Shimla District & Tehsil
  let shimlaDistrict = await prisma.district.findFirst({
    where: { name: { contains: "Shimla", mode: "insensitive" } },
  });
  if (!shimlaDistrict) {
    shimlaDistrict = await prisma.district.create({
      data: { name: "Shimla", lgdCode: 24 },
    });
  }

  let shimlaTehsil = await prisma.tehsil.findFirst({
    where: { districtId: shimlaDistrict.id },
  });
  if (!shimlaTehsil) {
    shimlaTehsil = await prisma.tehsil.create({
      data: { name: "Shimla Urban", lgdCode: 2401, districtId: shimlaDistrict.id },
    });
  }

  let shimlaVillage = await prisma.village.findFirst({
    where: { tehsilId: shimlaTehsil.id },
  });
  if (!shimlaVillage) {
    shimlaVillage = await prisma.village.create({
      data: { name: "Kasumpti", lgdCode: 240101, tehsilId: shimlaTehsil.id },
    });
  }

  // 2. Kangra District & Indora Tehsil
  let kangraDistrict = await prisma.district.findFirst({
    where: { name: { contains: "Kangra", mode: "insensitive" } },
  });
  if (!kangraDistrict) {
    kangraDistrict = await prisma.district.create({
      data: { name: "Kangra", lgdCode: 21 },
    });
  }

  let indoraTehsil = await prisma.tehsil.findFirst({
    where: { districtId: kangraDistrict.id, name: { contains: "Indora", mode: "insensitive" } },
  });
  if (!indoraTehsil) {
    indoraTehsil = await prisma.tehsil.create({
      data: { name: "Indora", lgdCode: 21094, districtId: kangraDistrict.id },
    });
  }

  let indoraVillage = await prisma.village.findFirst({
    where: { tehsilId: indoraTehsil.id },
  });
  if (!indoraVillage) {
    indoraVillage = await prisma.village.create({
      data: { name: "Indora (Ct)", lgdCode: 2109401, tehsilId: indoraTehsil.id },
    });
  }

  // 3. Officers - Shimla
  let daShimla = await prisma.user.findFirst({ where: { email: "da.shimla@edistrict.gov.in" } });
  if (!daShimla) {
    daShimla = await prisma.user.create({
      data: {
        fullName: "Ramesh Chand (DA)",
        email: "da.shimla@edistrict.gov.in",
        phone: "9816011111",
        password: officerHash,
        role: Role.DA,
        districtId: shimlaDistrict.id,
        tehsilId: shimlaTehsil.id,
        villageId: shimlaVillage.id,
        isActive: true,
      },
    });
  }

  let patwariShimla = await prisma.user.findFirst({ where: { email: "patwari.kasumpti@edistrict.gov.in" } });
  if (!patwariShimla) {
    patwariShimla = await prisma.user.create({
      data: {
        fullName: "Suresh Sharma (Patwari)",
        email: "patwari.kasumpti@edistrict.gov.in",
        phone: "9816022222",
        password: officerHash,
        role: Role.PATWARI,
        districtId: shimlaDistrict.id,
        tehsilId: shimlaTehsil.id,
        villageId: shimlaVillage.id,
        isActive: true,
      },
    });
  }

  let tehsildarShimla = await prisma.user.findFirst({ where: { email: "tehsildar.shimla@edistrict.gov.in" } });
  if (!tehsildarShimla) {
    tehsildarShimla = await prisma.user.create({
      data: {
        fullName: "Dr. Arvind Thakur (Tehsildar)",
        email: "tehsildar.shimla@edistrict.gov.in",
        phone: "9816033333",
        password: officerHash,
        role: Role.TEHSILDAR,
        districtId: shimlaDistrict.id,
        tehsilId: shimlaTehsil.id,
        villageId: shimlaVillage.id,
        isActive: true,
      },
    });
  }

  // 4. Officers - Kangra / Indora
  let daIndora = await prisma.user.findFirst({ where: { email: "da.indora@edistrict.gov.in" } });
  if (!daIndora) {
    daIndora = await prisma.user.create({
      data: {
        fullName: "Rakesh Kumar (Dealing Assistant)",
        email: "da.indora@edistrict.gov.in",
        phone: "9816111111",
        password: officerHash,
        role: Role.DA,
        districtId: kangraDistrict.id,
        tehsilId: indoraTehsil.id,
        villageId: indoraVillage.id,
        isActive: true,
      },
    });
  }

  let patwariIndora = await prisma.user.findFirst({ where: { email: "patwari.indora@edistrict.gov.in" } });
  if (!patwariIndora) {
    patwariIndora = await prisma.user.create({
      data: {
        fullName: "Kuldeep Singh (Halqa Patwari)",
        email: "patwari.indora@edistrict.gov.in",
        phone: "9816222222",
        password: officerHash,
        role: Role.PATWARI,
        districtId: kangraDistrict.id,
        tehsilId: indoraTehsil.id,
        villageId: indoraVillage.id,
        isActive: true,
      },
    });
  }

  let tehsildarIndora = await prisma.user.findFirst({ where: { email: "tehsildar.indora@edistrict.gov.in" } });
  if (!tehsildarIndora) {
    tehsildarIndora = await prisma.user.create({
      data: {
        fullName: "Bhuvnesh Kumar (Naib-Tehsildar)",
        email: "tehsildar.indora@edistrict.gov.in",
        phone: "9816333333",
        password: officerHash,
        role: Role.TEHSILDAR,
        districtId: kangraDistrict.id,
        tehsilId: indoraTehsil.id,
        villageId: indoraVillage.id,
        isActive: true,
      },
    });
  }

  // 5. Admin
  let admin = await prisma.user.findFirst({ where: { email: "admin@edistrict.gov.in" } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        fullName: "HP State Admin",
        email: "admin@edistrict.gov.in",
        phone: "9816000000",
        password: adminHash,
        role: Role.ADMIN,
        isActive: true,
      },
    });
  }

  // 6. Citizens
  let citizenNitin = await prisma.user.findFirst({ where: { email: "citizen.nitin@edistrict.gov.in" } });
  if (!citizenNitin) {
    citizenNitin = await prisma.user.create({
      data: {
        fullName: "Nitin Kaundal",
        email: "citizen.nitin@edistrict.gov.in",
        phone: "9816099999",
        password: citizenHash,
        role: Role.CITIZEN,
        districtId: kangraDistrict.id,
        tehsilId: indoraTehsil.id,
        villageId: indoraVillage.id,
        isActive: true,
      },
    });
  }

  await prisma.citizenProfile.upsert({
    where: { userId: citizenNitin.id },
    update: {
      districtId: kangraDistrict.id,
      tehsilId: indoraTehsil.id,
      villageId: indoraVillage.id,
    },
    create: {
      userId: citizenNitin.id,
      aadhaarNumber: "912345678901",
      gender: Gender.MALE,
      dateOfBirth: new Date("2000-08-20"),
      fatherName: "Ashwani Kumar",
      motherName: "Jeewana Kumari",
      address: "VPO INDORA TEH INDORA DISTT KANGRA HP 176401",
      pincode: "176401",
      districtId: kangraDistrict.id,
      tehsilId: indoraTehsil.id,
      villageId: indoraVillage.id,
    },
  });

  let citizenAshwani = await prisma.user.findFirst({ where: { email: "citizen.ashwani@edistrict.gov.in" } });
  if (!citizenAshwani) {
    citizenAshwani = await prisma.user.create({
      data: {
        fullName: "Ashwani Kumar",
        email: "citizen.ashwani@edistrict.gov.in",
        phone: "9816088888",
        password: citizenHash,
        role: Role.CITIZEN,
        districtId: kangraDistrict.id,
        tehsilId: indoraTehsil.id,
        villageId: indoraVillage.id,
        isActive: true,
      },
    });
  }

  await prisma.citizenProfile.upsert({
    where: { userId: citizenAshwani.id },
    update: {
      districtId: kangraDistrict.id,
      tehsilId: indoraTehsil.id,
      villageId: indoraVillage.id,
    },
    create: {
      userId: citizenAshwani.id,
      aadhaarNumber: "987654321012",
      gender: Gender.MALE,
      dateOfBirth: new Date("1975-04-12"),
      fatherName: "Late. Chaman Lal",
      motherName: "Smt. Shanti Devi",
      address: "VPO INDORA TEH INDORA DISTT KANGRA HP 176401",
      pincode: "176401",
      districtId: kangraDistrict.id,
      tehsilId: indoraTehsil.id,
      villageId: indoraVillage.id,
    },
  });

  // Services
  const services = await prisma.certificateService.findMany();
  const incomeService = services.find((s) => s.code.includes("INCOME")) || services[0];
  const bonafideService = services.find((s) => s.code.includes("BONAFIDE")) || services[0];

  // 7. Seed Official Approved Income Certificate for Ashwani Kumar (matching official HP sample)
  let appApproved = await prisma.application.findUnique({
    where: { applicationNumber: "HP-2026-403968" },
  });

  const certNum = "INC2026714423324417";
  const approvedPayload = {
    applicationNumber: "HP-2026-403968",
    applicantId: citizenAshwani.id,
    certificateServiceId: incomeService.id,
    status: ApplicationStatus.APPROVED,
    isSubmitted: true,
    currentStage: WorkflowStage.COMPLETED,
    assignedDAId: daIndora.id,
    assignedPatwariId: patwariIndora.id,
    assignedTehsildarId: tehsildarIndora.id,
    stageStartedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    certificateNumber: certNum,
    certificateIssuedAt: new Date(),
    remarks: "Approved by Naib-Tehsildar after field inquiry and revenue record verification.",
    formData: {
      salutation: "Shri",
      applicantName: "Ashwani Kumar",
      relationType: "Son of",
      relativeName: "Late. Chaman Lal",
      district: "KANGRA",
      tehsil: "Indora",
      village: "Indora",
      address: "VPO INDORA TEH INDORA DISTT KANGRA HP 176401",
      annualIncome: "100000",
      incomeSource: "Agriculture & Private Business",
      purpose: "Higher Education Scholarship and Family Record",
      familyMembers: [
        { name: "Jeewana Kumari", relation: "WIFE/पत्नी" },
        { name: "Nitin Kaundal", relation: "SON/पुत्र" },
        { name: "Jatin Koundal", relation: "SON/पुत्र" },
      ],
    },
  };

  if (!appApproved) {
    appApproved = await prisma.application.create({
      data: approvedPayload,
    });

    await prisma.applicationHistory.createMany({
      data: [
        {
          applicationId: appApproved.id,
          officerId: citizenAshwani.id,
          fromStage: WorkflowStage.DA,
          toStage: WorkflowStage.DA,
          action: WorkflowAction.FORWARD,
          remarks: "Application submitted online with affidavit & income details.",
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
        {
          applicationId: appApproved.id,
          officerId: daIndora.id,
          fromStage: WorkflowStage.DA,
          toStage: WorkflowStage.PATWARI,
          action: WorkflowAction.FORWARD,
          remarks: "Initial scrutiny completed. Forwarded to Halqa Patwari for field inquiry.",
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
        },
        {
          applicationId: appApproved.id,
          officerId: patwariIndora.id,
          fromStage: WorkflowStage.PATWARI,
          toStage: WorkflowStage.DA_REVIEW,
          action: WorkflowAction.FORWARD,
          remarks: "Field inquiry conducted in Muhal Indora. Total assessed family income verified as Rs 1,00,000.",
          createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
        },
        {
          applicationId: appApproved.id,
          officerId: daIndora.id,
          fromStage: WorkflowStage.DA_REVIEW,
          toStage: WorkflowStage.TEHSILDAR,
          action: WorkflowAction.FORWARD,
          remarks: "Patwari report verified. Recommended for Tehsildar approval.",
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        },
        {
          applicationId: appApproved.id,
          officerId: tehsildarIndora.id,
          fromStage: WorkflowStage.TEHSILDAR,
          toStage: WorkflowStage.COMPLETED,
          action: WorkflowAction.APPROVE,
          remarks: "Approved and digitally signed. Official income certificate issued.",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ],
    });
  } else {
    await prisma.application.update({
      where: { id: appApproved.id },
      data: approvedPayload,
    });
  }

  try {
    await generateCertificate(appApproved.id);
    console.log(`✅ Seeded Official Certificate: ${certNum}`);
  } catch (err) {
    console.warn("Certificate generation during seed:", err);
  }

  // 8. Seed an Application with CORRECTION_REQUIRED for Nitin Kaundal
  let appCorrection = await prisma.application.findUnique({
    where: { applicationNumber: "HP-2026-894210" },
  });

  const correctionPayload = {
    applicationNumber: "HP-2026-894210",
    applicantId: citizenNitin.id,
    certificateServiceId: incomeService.id,
    status: ApplicationStatus.CORRECTION_REQUIRED,
    isSubmitted: true,
    currentStage: WorkflowStage.DA,
    assignedDAId: daIndora.id,
    assignedPatwariId: patwariIndora.id,
    assignedTehsildarId: tehsildarIndora.id,
    stageStartedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
    priorityScore: 70,
    remarks: "Please update residential address format and upload the latest signed affidavit.",
    formData: {
      salutation: "Shri",
      applicantName: "Nitin Kaundal",
      relationType: "Son of",
      relativeName: "Ashwani Kumar",
      district: "KANGRA",
      tehsil: "Indora",
      village: "Indora",
      address: "VPO Indora",
      annualIncome: "120000",
      incomeSource: "Agriculture",
      purpose: "Higher Studies & Scholarship",
      familyMembers: [
        { name: "Ashwani Kumar", relation: "FATHER/पिता" },
        { name: "Jeewana Kumari", relation: "MOTHER/माता" },
      ],
    },
  };

  if (!appCorrection) {
    appCorrection = await prisma.application.create({
      data: correctionPayload,
    });

    await prisma.applicationHistory.createMany({
      data: [
        {
          applicationId: appCorrection.id,
          officerId: citizenNitin.id,
          fromStage: WorkflowStage.DA,
          toStage: WorkflowStage.DA,
          action: WorkflowAction.FORWARD,
          remarks: "Application submitted.",
          createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
        },
        {
          applicationId: appCorrection.id,
          officerId: daIndora.id,
          fromStage: WorkflowStage.DA,
          toStage: WorkflowStage.DA,
          action: WorkflowAction.CORRECTION_REQUIRED,
          remarks: "Please update residential address format and upload the latest signed affidavit.",
          createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
        },
      ],
    });
  } else {
    await prisma.application.update({
      where: { id: appCorrection.id },
      data: correctionPayload,
    });
  }

  console.log("✅ Seeded Correction Required Application for testing edit mode");
  console.log("🎉 Demo Seeder Finished Successfully!");
}
