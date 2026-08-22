import {
  LayoutDashboard,
  FilePlus2,
  FolderOpen,
  BadgeCheck,
  User,
  ClipboardList,
  Clock3,
  Users,
  Building2,
  FileCog,
  FileText,
  Settings,
} from "lucide-react";

/* ================= Citizen ================= */

export const citizenMenu = [
  {
    section: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
    ],
  },

  {
    section: "Citizen Services",
    items: [
      {
        title: "Apply Certificate",
        icon: FilePlus2,
        path: "/services",
      },
      {
        title: "My Applications",
        icon: FolderOpen,
        path: "/applications",
      },
      {
        title: "Certificates",
        icon: BadgeCheck,
        path: "/certificates",
      },
    ],
  },

  {
    section: "Account",
    items: [
      {
        title: "Profile",
        icon: User,
        path: "/profile",
      },
    ],
  },
];

/* ================= Officer ================= */

export const officerMenu = [
  {
    section: "Workflow",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/officer/dashboard",
      },

      {
        title: "Pending Applications",
        icon: ClipboardList,
        path: "/officer/pending",
      },

      {
        title: "History",
        icon: Clock3,
        path: "/officer/history",
      },
    ],
  },
];

/* ================= Admin ================= */

export const adminMenu = [
  {
    section: "Administration",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },

      {
        title: "Officers",
        icon: Users,
        path: "/admin/officers",
      },

      {
        title: "Departments",
        icon: Building2,
        path: "/admin/departments",
      },

      {
        title: "Certificate Services",
        icon: FileCog,
        path: "/admin/services",
      },

      {
        title: "Applications",
        icon: FileText,
        path: "/admin/applications",
      },

      {
        title: "Reports",
        icon: FileText,
        path: "/admin/reports",
      },

      {
        title: "Grievances",
        icon: ClipboardList,
        path: "/admin/grievances",
      },

      {
        title: "Settings",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
  },
];