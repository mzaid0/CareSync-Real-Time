export const notifications: Notification[] = [
  { type: "task", message: "Care plan updated by Sarah!" },
  { type: "appointment", message: "New appointment scheduled for 3 PM." },
  { type: "medication", message: "Medication reminder sent to John." },
  { type: "alert", message: "Emergency alert resolved." },
];

export const features: Feature[] = [
  {
    iconKey: "FaTasks",
    title: "Care Plans",
    desc: "Dynamic scheduling for daily tasks.",
  },
  {
    iconKey: "FaCalendarAlt",
    title: "Appointments",
    desc: "Effortless medical visit management.",
  },
  {
    iconKey: "FaPills",
    title: "Medications",
    desc: "Precise tracking and reminders.",
  },
  {
    iconKey: "FaBell",
    title: "Alerts",
    desc: "Instant emergency notifications.",
  },
  { iconKey: "FaFileAlt", title: "Files", desc: "Secure document sharing." },
];

export const developerInfo: DeveloperInfo = {
  name: "Muhammad Zaid",
  title: "Full-Stack Developer",
  description:
    "A Software Engineering graduate from the University of Sialkot, Muhammad Zaid built CareSync to revolutionize caregiving with real-time technology.",
  avatarSrc: "/zaid.png",
  avatarFallback: "MZ",
  techStack: ["React", "Node.js", "MongoDB", "Socket.IO", "Redis", "Docker"],
  socialLinks: [
    {
      platform: "LinkedIn",
      url:
        import.meta.env.VITE_LINKEDIN_URL ||
        "https://linkedin.com/in/zaidazmat",
      iconKey: "FaLinkedin",
      ariaLabel: "Visit Muhammad Zaid's LinkedIn",
    },
    {
      platform: "GitHub",
      url: import.meta.env.VITE_GITHUB_URL || "https://github.com/mzaid0",
      iconKey: "FaGithub",
      ariaLabel: "Visit Muhammad Zaid's GitHub",
    },
  ],
};

export interface Notification {
  type: "task" | "appointment" | "medication" | "alert";
  message: string;
}

export interface Feature {
  iconKey: string;
  title: string;
  desc: string;
}

export interface DeveloperInfo {
  name: string;
  title: string;
  description: string;
  avatarSrc: string;
  avatarFallback: string;
  techStack: string[];
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  iconKey: string;
  ariaLabel: string;
}
