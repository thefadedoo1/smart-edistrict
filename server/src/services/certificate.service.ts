import prisma from "../config/prisma";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { CERTIFICATES_DIR } from "../config/paths";
import { ensureAssets } from "../utils/initAssets";
import { numberToWordsIndian } from "../utils/currency";

function generateCertificateNumber(serviceCode: string = "INC"): string {
  const prefix = serviceCode.includes("BONAFIDE") ? "BON" : serviceCode.includes("CASTE") ? "CST" : "INC";
  const year = new Date().getFullYear();
  const random = Math.floor(100000000000 + Math.random() * 900000000000);
  return `${prefix}${year}${random}`;
}

export async function generateCertificate(applicationId: string) {
  ensureAssets();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicant: {
        include: {
          profile: {
            include: {
              district: true,
              tehsil: true,
              village: true,
            },
          },
        },
      },
      certificateService: true,
      assignedTehsildar: true,
      documents: {
        include: { requiredDocument: true },
      },
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== "APPROVED") {
    throw new Error("Application is not approved by Tehsildar yet.");
  }

  const certificateNumber =
    application.certificateNumber || generateCertificateNumber(application.certificateService.code);
  const fileName = `${certificateNumber}.pdf`;
  const filePath = path.resolve(CERTIFICATES_DIR, fileName);

  const verifyUrl = `http://localhost:5173/verify/${certificateNumber}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
  const qrImageBuffer = Buffer.from(qrDataUrl.split(",")[1] || "", "base64");

  const formData = (application.formData as Record<string, any>) || {};

  // Resolve Names, Salutation, Relation, Location
  const salutation = formData.salutation || "Shri";
  const applicantName = formData.applicantName || application.applicant.fullName;
  const relationType = formData.relationType || "Son of";
  const relativeName = formData.relativeName || formData.fatherName || application.applicant.profile?.fatherName || "Sh. Concerned";
  const address = formData.address || application.applicant.profile?.address || "Himachal Pradesh";
  const village = formData.village || application.applicant.profile?.village?.name || "Indora";
  const tehsil = formData.tehsil || application.applicant.profile?.tehsil?.name || "Indora";
  const district = (formData.district || application.applicant.profile?.district?.name || "KANGRA").toUpperCase();

  const incomeAmount = Number(formData.annualIncome || "100000");
  const incomeWords = numberToWordsIndian(incomeAmount);
  const currentYear = new Date().getFullYear();
  const validityText = `Validity: Current FY. ${currentYear}-${(currentYear + 1).toString().slice(2)}`;

  const serviceName = application.certificateService.name;
  let titleEng = "INCOME CERTIFICATE";
  let formType = "Form D";
  let formPara = "(See Para 28.10)";

  if (serviceName.toLowerCase().includes("bonafide")) {
    titleEng = "BONAFIDE HIMACHALI CERTIFICATE";
    formType = "Form A";
    formPara = "(See Para 12.4)";
  } else if (serviceName.toLowerCase().includes("caste")) {
    titleEng = "CASTE CERTIFICATE";
    formType = "Form B";
    formPara = "(See Para 15.2)";
  }

  // Tehsildar / Authority Details
  const rawOfficerName = application.assignedTehsildar?.fullName || "Bhuvnesh Kumar";
  const tehsildarName = rawOfficerName.replace(/\s*\([^)]*\)/g, "").trim() || "Tehsildar Office";
  const designation = "Tehsildar";
  const approvalDate = (application.updatedAt || new Date()).toLocaleDateString("en-GB");

  // Format clean relation in English
  const sanitizeRelation = (rel: string) => {
    if (!rel) return "Family Member";
    return rel
      .replace(/\/.*$/, "")
      .replace(/_/g, " ")
      .trim();
  };

  // Family Members Table Data — only use what the applicant actually filled in
  const rawFamily = Array.isArray(formData.familyMembers)
    ? formData.familyMembers.filter((m: any) => (m.name || m.fullName || "").trim() !== "")
    : [];

  const familyMembers = rawFamily.map((m: any) => ({
    name: m.name || m.fullName || "Family Member",
    relation: sanitizeRelation(m.relation || m.relationship || "Member"),
  }));


  // Resolve Photo and Logo asset paths
  const serverAssetsDir = path.resolve(__dirname, "../../assets");
  const logoPath = path.join(serverAssetsDir, "hp-govt-logo.png");
  const defaultPhotoPath = path.join(serverAssetsDir, "default-photo.png");

  // Check if applicant uploaded a photo document
  const photoDoc = application.documents.find((d) =>
    d.requiredDocument?.name.toLowerCase().includes("photo") || d.mimeType?.startsWith("image/")
  );
  let applicantPhotoPath = defaultPhotoPath;
  if (photoDoc && photoDoc.fileUrl) {
    const customPhoto = path.resolve(__dirname, "../../", photoDoc.fileUrl.replace(/^\//, ""));
    if (fs.existsSync(customPhoto)) {
      applicantPhotoPath = customPhoto;
    }
  }

  // Generate PDF
  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 30 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 1. Double Blue Border
    const borderBlue = "#0F4C81";
    doc.rect(20, 20, 555, 802).lineWidth(2.5).strokeColor(borderBlue).stroke();
    doc.rect(25, 25, 545, 792).lineWidth(0.8).strokeColor(borderBlue).stroke();

    // 1.5 Center Watermark Logo
    if (fs.existsSync(logoPath)) {
      try {
        doc.save();
        doc.opacity(0.08);
        doc.image(logoPath, 147.5, 300, { width: 300, align: 'center' });
        doc.restore();
      } catch (e) {
        console.warn("Watermark render error:", e);
      }
    }

    // 2. HP Government Logo (Top-Left)
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, 35, 35, { width: 90, height: 65, fit: [90, 65] });
      } catch (e) {
        console.warn("Logo render error:", e);
      }
    }

    // 3. Applicant Passport Photo (Top-Right)
    const photoX = 460;
    const photoY = 35;
    const photoW = 75;
    const photoH = 85;
    doc.rect(photoX, photoY, photoW, photoH).lineWidth(1).strokeColor("#9CA3AF").stroke();
    if (fs.existsSync(applicantPhotoPath)) {
      try {
        doc.image(applicantPhotoPath, photoX + 2, photoY + 2, {
          width: photoW - 4,
          height: photoH - 4,
          fit: [photoW - 4, photoH - 4],
        });
      } catch (e) {
        console.warn("Photo render error:", e);
      }
    }

    // 4. Center Official Header (English Only)
    doc.fontSize(10).fillColor("#1E3A8A").font("Helvetica-Bold").text("GOVERNMENT OF HIMACHAL PRADESH", 130, 36, { align: "center", width: 325 });
    doc.fontSize(13).fillColor("#0F4C81").font("Helvetica-Bold").text("OFFICE OF THE TEHSILDAR", 130, 50, { align: "center", width: 325 });
    doc.fontSize(9.5).fillColor("#374151").font("Helvetica-Bold").text(`Tehsil : ${tehsil}, District : ${district} (H.P.)`, 130, 68, { align: "center", width: 325 });
    doc.fontSize(9).fillColor("#4B5563").font("Helvetica").text(`${formType} ${formPara}`, 130, 83, { align: "center", width: 325 });
    doc.fontSize(12).fillColor("#111827").font("Helvetica-Bold").text(titleEng, 130, 98, { align: "center", width: 325 });

    // 5. Reference Metadata Bar
    doc.moveTo(35, 122).lineTo(560, 122).lineWidth(0.8).strokeColor("#D1D5DB").stroke();
    doc.fontSize(8.5).fillColor("#1F2937").font("Helvetica");
    doc.text(`Certificate No: ${certificateNumber}`, 35, 128);
    doc.text(`Application No: ${application.applicationNumber}`, 230, 128);
    doc.text(validityText, 410, 128, { align: "right", width: 150 });
    doc.moveTo(35, 142).lineTo(560, 142).lineWidth(0.8).strokeColor("#D1D5DB").stroke();

    // 6. Certificate Body (Clear Official English Paragraph)
    let bodyY = 156;

    const englishText = `This is to certify that on the basis of verified revenue inquiries and records produced before this authority, the total annual family income of ${salutation} ${applicantName}, ${relationType} ${relativeName}, resident of Village / Muhal ${village}, Tehsil ${tehsil}, District ${district} (Himachal Pradesh) from all known sources is assessed as:`;

    doc.fontSize(9.5).fillColor("#111827").font("Helvetica").text(englishText, 35, bodyY, {
      align: "justify",
      width: 525,
      lineGap: 3.5,
    });

    bodyY = doc.y + 8;

    // Income Highlight Box
    doc.rect(35, bodyY, 525, 26).lineWidth(0.5).strokeColor("#93C5FD").fillColor("#EFF6FF").fillAndStroke();
    doc.fontSize(10).fillColor("#1E3A8A").font("Helvetica-Bold").text(
      `Rs. ${incomeAmount.toLocaleString("en-IN")} /- (${incomeWords})`,
      35,
      bodyY + 8,
      { align: "center", width: 525 }
    );

    bodyY += 36;

    // 7. Family Members Section (only if applicant provided them)
    if (familyMembers.length > 0) {
      doc.fontSize(8.5).fillColor("#374151").font("Helvetica-Bold").text(
        "Details of Family Members (As per verified affidavit and revenue records):",
        35,
        bodyY,
        { width: 525 }
      );

      bodyY = doc.y + 8;

      // 8. Family Members Table
      const tableX = 40;
      const tableW = 515;
      const col1W = 60;
      const col2W = 280;
      const col3W = 175;

      // Header Background
      doc.rect(tableX, bodyY, tableW, 20).fillColor("#F3F4F6").fill();
      doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#111827");
      doc.text("S.No.", tableX + 10, bodyY + 6);
      doc.text("Member Full Name", tableX + col1W, bodyY + 6);
      doc.text("Relationship with Applicant", tableX + col1W + col2W, bodyY + 6);

      bodyY += 20;
      doc.moveTo(tableX, bodyY).lineTo(tableX + tableW, bodyY).lineWidth(0.5).strokeColor("#D1D5DB").stroke();

      familyMembers.slice(0, 12).forEach((member: any, idx: number) => {
        bodyY += 5;
        doc.fontSize(8.5).font("Helvetica").fillColor("#374151");
        doc.text(String(idx + 1), tableX + 15, bodyY);
        doc.text(member.name, tableX + col1W, bodyY);
        doc.text(member.relation, tableX + col1W + col2W, bodyY);
        bodyY += 14;
        doc.moveTo(tableX, bodyY).lineTo(tableX + tableW, bodyY).lineWidth(0.3).strokeColor("#E5E7EB").stroke();
      });
    }

    // 9. Approving Authority Block
    bodyY = Math.max(bodyY + 30, 520);
    const authBoxX = 240;

    doc.fontSize(9.5).font("Helvetica-Bold").fillColor("#111827").text("Approving Authority Details", authBoxX, bodyY, { align: "center", width: 315 });
    bodyY += 16;

    // Stamp seal Simulation
    doc.rect(authBoxX + 10, bodyY, 115, 52).lineWidth(0.8).strokeColor("#0F4C81").fillColor("#F0F9FF").fillAndStroke();
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0F4C81").text("DIGITALLY SIGNED", authBoxX + 15, bodyY + 8, { width: 105, align: "center" });
    doc.fontSize(7).font("Helvetica-Bold").fillColor("#1E3A8A").text("Office of the Tehsildar", authBoxX + 15, bodyY + 22, { width: 105, align: "center" });
    doc.fontSize(6.5).font("Helvetica").fillColor("#1E3A8A").text(`Tehsil ${tehsil} (${district})`, authBoxX + 15, bodyY + 36, { width: 105, align: "center" });

    // Authority Details on the right of stamp
    const detailX = authBoxX + 135;
    doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#111827").text("Name:", detailX, bodyY);
    doc.font("Helvetica").text(tehsildarName, detailX + 75, bodyY);

    doc.font("Helvetica-Bold").text("Designation:", detailX, bodyY + 14);
    doc.font("Helvetica").text(designation, detailX + 75, bodyY + 14);

    doc.font("Helvetica-Bold").text("Tehsil / Office:", detailX, bodyY + 28);
    doc.font("Helvetica").text(tehsil, detailX + 75, bodyY + 28);

    doc.font("Helvetica-Bold").text("District:", detailX, bodyY + 42);
    doc.font("Helvetica").text(district, detailX + 75, bodyY + 42);

    doc.font("Helvetica-Bold").text("Approval Date:", detailX, bodyY + 56);
    doc.font("Helvetica").text(approvalDate, detailX + 75, bodyY + 56);

    // 10. Bottom Disclaimer & QR Code Box
    const footerY = Math.max(bodyY + 75, 670);
    doc.moveTo(35, footerY).lineTo(560, footerY).lineWidth(0.8).strokeColor("#D1D5DB").stroke();

    // Disclaimer text
    const disclaimW = 390;
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#374151").text("Disclaimer:- ", 35, footerY + 8, { continued: true });
    doc.font("Helvetica").text(
      "This is an electronically generated and digitally authenticated official certificate. It does not require a physical wet signature. The authenticity can be verified online or by scanning the secure QR code.",
      {
        width: disclaimW,
        align: "justify",
        lineGap: 2,
      }
    );

    doc.moveDown(0.6);
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#374151").text("Verification Portal:- ", { continued: true });
    doc.font("Helvetica").text(
      `Access Himachal Pradesh HimSeva Portal or verify directly at ${verifyUrl}`,
      {
        width: disclaimW,
        lineGap: 2,
      }
    );

    // QR Code on right
    doc.image(qrImageBuffer, 450, footerY + 6, { width: 100, height: 100 });
    doc.fontSize(6.5).fillColor("#6B7280").text("Scan to verify", 450, footerY + 110, { width: 100, align: "center" });

    doc.end();

    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });

  const certificateUrl = `/certificates/${fileName}`;

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      certificateNumber,
      certificateUrl,
      certificateIssuedAt: new Date(),
    },
  });

  return {
    certificateNumber,
    fileName,
    certificateUrl,
    verifyUrl,
  };
}

export async function getCitizenCertificates(citizenId: string) {
  const applications = await prisma.application.findMany({
    where: {
      applicantId: citizenId,
      status: "APPROVED",
      certificateNumber: { not: null },
    },
    include: {
      certificateService: true,
      assignedTehsildar: { select: { fullName: true } },
    },
    orderBy: { certificateIssuedAt: "desc" },
  });

  return applications.map((app) => {
    const rawOfficerName = app.assignedTehsildar?.fullName || "Office of the Tehsildar";
    const officerName = rawOfficerName.replace(/\s*\([^)]*\)/g, "").trim();

    return {
      id: app.id,
      applicationNumber: app.applicationNumber,
      certificateNumber: app.certificateNumber,
      serviceName: app.certificateService.name,
      serviceCode: app.certificateService.code,
      issuedAt: app.certificateIssuedAt || app.updatedAt,
      issuedBy: `${officerName} (Tehsildar)`,
      certificateUrl: app.certificateUrl,
      downloadUrl: `/api/certificates/download/${app.certificateNumber}.pdf`,
      viewUrl: `/api/certificates/view/${app.certificateNumber}`,
      verifyUrl: `/verify/${app.certificateNumber}`,
    };
  });
}

export async function verifyCertificateDetails(certificateNumber: string) {
  const application = await prisma.application.findFirst({
    where: { certificateNumber },
    include: {
      applicant: {
        include: {
          profile: {
            include: {
              district: true,
              tehsil: true,
              village: true,
            },
          },
        },
      },
      certificateService: true,
      assignedTehsildar: true,
    },
  });

  if (!application) {
    return null;
  }

  const formData = (application.formData as Record<string, any>) || {};
  const rawOfficerName = application.assignedTehsildar?.fullName || "Bhuvnesh Kumar";
  const officerName = rawOfficerName.replace(/\s*\([^)]*\)/g, "").trim();

  return {
    valid: true,
    certificateNumber: application.certificateNumber,
    serviceName: application.certificateService.name,
    salutation: formData.salutation || "Shri",
    applicantName: formData.applicantName || application.applicant.fullName,
    relationType: formData.relationType || "Son of",
    relativeName: formData.relativeName || formData.fatherName || application.applicant.profile?.fatherName || "N/A",
    district: formData.district || application.applicant.profile?.district?.name || "KANGRA",
    tehsil: formData.tehsil || application.applicant.profile?.tehsil?.name || "Indora",
    village: formData.village || application.applicant.profile?.village?.name || "Indora",
    address: formData.address || application.applicant.profile?.address || "Himachal Pradesh",
    annualIncome: formData.annualIncome || "100000",
    issuedAt: application.certificateIssuedAt || application.updatedAt,
    issuedBy: `${officerName} (Tehsildar)`,
    status: application.status,
    applicationNumber: application.applicationNumber,
    certificateUrl: application.certificateUrl,
    downloadUrl: `/api/certificates/download/${application.certificateNumber}.pdf`,
  };
}