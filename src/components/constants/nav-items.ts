import {
    LayoutPanelTop,
    SettingsIcon,
    QrCode,
    PanelTopDashed,
    ForkKnifeCrossedIcon,
    Users2,
    PencilLine,
    HeartCrack,
    BookMarkedIcon,
    ScanQrCode,
    BookHeadphones,
    UserPlus2,
    UserCog2,
    BookOpenText,
    ForkKnifeIcon,
  } from "lucide-react";
  
  export const items = [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutPanelTop,
    },
    {
      name: "Orders",
      url: "/orders",
      icon: ForkKnifeCrossedIcon,
    },
    {
      name: "Menu",
      url: "/menu",
      icon: PanelTopDashed,
    },
    {
      name: "Tables",
      url: "/create-table",
      icon: QrCode,
      children: [
        {
          name: "Create Table",
          url: "/create-table",
          icon: ScanQrCode,
        },
        {
          name: "Manage Tables",
          url: "/manage-tables",
          icon: BookHeadphones,
        },
      ],
    },
    {
      name: "Staff Management",
      // url: "/create-staff",
      icon: Users2,
      children: [
        {
          name: "Create Staff",
          url: "/create-staff",
          icon: UserPlus2,
        },
        {
          name: "Manage Staff",
          url: "/manage-staff",
          icon: UserCog2,
        },
      ],
    },
    {
      name: "Service Point",
      // url: "/create-staff",
      icon: ForkKnifeIcon,
      children: [
        {
          name: "Create Service Point",
          url: "/create-sp",
          icon: UserPlus2,
        },
        {
          name: "Manage Service Point",
          url: "/manage-sp",
          icon: UserCog2,
        },
      ],
    },
    // {
    //   name: "Location",
    //   url: "/location",
    //   icon: PinIcon,
    // },
    {
      name: "Reports",
      icon: BookOpenText,
      url: "/feedback",
      children: [
        {
          name: "Feedback",
          url: "/feedback",
          icon: BookMarkedIcon,
        },
        {
          name: "Reviews",
          url: "/reviews",
          icon: PencilLine,
        },
        {
          name: "Complaints",
          url: "/complaints",
          icon: HeartCrack,
        },
      ],
    },
    {
      name: "Account",
      icon: SettingsIcon,
      children: [
        {
          name: "Businesses",
          url: "/businesses",
          icon: LayoutPanelTop,
        },
        {
          name: "Settings",
          url: "/settings",
          icon: SettingsIcon,
        },
      ],
    },
  ];
  