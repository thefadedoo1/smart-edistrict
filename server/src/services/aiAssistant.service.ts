import prisma from "../config/prisma";
import { WorkflowStage } from "@prisma/client";
import { getStageSLAInfo } from "./sla.service";
import { predictApplicationCompletion } from "./aiPrediction.service";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string; link?: string }[];
}

export async function handleAssistantQuery(
  userId: string,
  userMessage: string,
  currentAppId?: string
): Promise<ChatMessage> {
  const query = userMessage.toLowerCase().trim();

  // 1. Check if user is asking about specific application or their latest application
  if (
    query.includes("where is my file") ||
    query.includes("where is my application") ||
    query.includes("status") ||
    query.includes("track") ||
    query.includes("delay") ||
    query.includes("why is it with patwari") ||
    currentAppId
  ) {
    // Find latest application for user or matching app number in message
    let app = null;

    const appNumMatch = userMessage.match(/HP-\d{4}-\d{6}/i);
    if (appNumMatch) {
      app = await prisma.application.findFirst({
        where: { applicationNumber: appNumMatch[0].toUpperCase() },
        include: {
          certificateService: true,
          assignedDA: true,
          assignedPatwari: true,
          assignedTehsildar: true,
        },
      });
    } else if (currentAppId) {
      app = await prisma.application.findUnique({
        where: { id: currentAppId },
        include: {
          certificateService: true,
          assignedDA: true,
          assignedPatwari: true,
          assignedTehsildar: true,
        },
      });
    } else {
      app = await prisma.application.findFirst({
        where: { applicantId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          certificateService: true,
          assignedDA: true,
          assignedPatwari: true,
          assignedTehsildar: true,
        },
      });
    }

    if (app) {
      const slaInfo = getStageSLAInfo(app.stageDeadline, app.stageStartedAt);
      const prediction = await predictApplicationCompletion(app);

      let officerName = "Officer";
      let stageDesc = "";

      switch (app.currentStage) {
        case WorkflowStage.DA:
          officerName = app.assignedDA?.fullName || "Dealing Assistant (Shimla)";
          stageDesc = "under initial document verification with Dealing Assistant";
          break;
        case WorkflowStage.PATWARI:
          officerName = app.assignedPatwari?.fullName || "Patwari (Kasumpti Circle)";
          stageDesc = "with Halqa Patwari for local revenue and field verification";
          break;
        case WorkflowStage.DA_REVIEW:
          officerName = app.assignedDA?.fullName || "Dealing Assistant";
          stageDesc = "under post-verification check by Dealing Assistant";
          break;
        case WorkflowStage.TEHSILDAR:
          officerName = app.assignedTehsildar?.fullName || "Tehsildar (Shimla Urban)";
          stageDesc = "with the Tehsildar for final approval and digital signature";
          break;
        case WorkflowStage.COMPLETED:
          return {
            sender: "bot",
            text: `🎉 Good news! Your **${app.certificateService.name}** (App No: \`${app.applicationNumber}\`) has been **APPROVED**! Certificate No: \`${app.certificateNumber}\` is ready for download.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            quickActions: [
              { label: "📄 Download Certificate", action: "DOWNLOAD", link: app.certificateUrl || `/applications/${app.id}` },
              { label: "🔍 Verify QR Code", action: "VERIFY", link: `/verify/${app.certificateNumber}` },
            ],
          };
      }

      let statusMsg = `📍 **File Journey Tracker (${app.applicationNumber})**\n\n`;
      statusMsg += `• **Service**: ${app.certificateService.name}\n`;
      statusMsg += `• **Current Officer**: ${officerName}\n`;
      statusMsg += `• **Stage**: ${stageDesc}\n`;
      statusMsg += `• **Timer Remaining**: ${slaInfo.isOverdue ? "⚠️ Overdue by " + slaInfo.overdueHours + "h" : "⏳ " + slaInfo.remainingHours + "h " + slaInfo.remainingMinutes + "m left"}\n`;
      statusMsg += `• **AI Expected Completion**: in **${prediction.predictedDaysRemaining} days** (${prediction.estimatedCompletionDate.toLocaleDateString("en-IN")})\n`;

      if (app.isEscalated) {
        statusMsg += `\n🚨 **Note**: This file had breached SLA limits and was **Auto-Escalated** to higher authorities for expedited resolution.`;
      }

      return {
        sender: "bot",
        text: statusMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickActions: [
          { label: "View Live Timeline", action: "VIEW_APP", link: `/applications/${app.id}` },
          { label: "Check Requirements", action: "DOCS" },
        ],
      };
    }
  }

  // 2. Questions about services/documents
  if (query.includes("bonafide") || query.includes("himachali")) {
    return {
      sender: "bot",
      text: `🏔️ **Bonafide Himachali Certificate Requirements**:\n1. Proof of Residence (Jamabandi or Electricity Bill)\n2. Proof of Identity (Aadhaar Card)\n3. Passport Size Photograph\n4. Ration Card / Family Register Copy\n\n⏱️ Standard SLA: **5 Working Days**.\nHierarchy: DA ➔ Patwari ➔ DA ➔ Tehsildar.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickActions: [{ label: "Apply for Bonafide", action: "APPLY", link: "/apply/BONAFIDE" }],
    };
  }

  if (query.includes("income") || query.includes("salary")) {
    return {
      sender: "bot",
      text: `💼 **Income Certificate Requirements**:\n1. Salary Slip / IT Return / Agricultural Income Proof\n2. Aadhaar Card\n3. Ration Card\n4. Affidavit of Annual Income\n\n⏱️ Standard SLA: **7 Working Days**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickActions: [{ label: "Apply for Income Cert", action: "APPLY", link: "/apply/INCOME" }],
    };
  }

  if (query.includes("caste") || query.includes("sc") || query.includes("st") || query.includes("obc")) {
    return {
      sender: "bot",
      text: `📜 **Caste / Category Certificate Requirements**:\n1. Ancestral Land Record / Jamabandi showing caste\n2. Father's / Guardian's Caste Certificate\n3. Aadhaar Card\n4. School Leaving Certificate\n\n⏱️ Standard SLA: **7-10 Working Days**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickActions: [{ label: "Apply for Caste Cert", action: "APPLY", link: "/apply/CASTE" }],
    };
  }

  // 3. Fallback generic reply with helpful menu
  return {
    sender: "bot",
    text: `Hello! I am your **Smart e-District AI Assistant** 🤖. I can help you with:\n\n• Tracking your live file journey & countdown timer\n• Checking documents required for certificates\n• Explaining delays and officer escalation\n• Verification of issued certificates\n\nHow can I help you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    quickActions: [
      { label: "📍 Where is my file?", action: "TRACK" },
      { label: "📜 Required Documents", action: "DOCS" },
      { label: "✨ Apply for Service", action: "APPLY", link: "/services" },
    ],
  };
}
