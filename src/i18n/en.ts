import type { Messages } from "./types";

export const en: Messages = {
  profile: {
    title: "Software Developer",
    firstName: "Mikhail",
    lastName: "Simanovich",
  },
  nav: {
    about: "About",
    stack: "Stack",
    experience: "Experience",
    contact: "Contact",
  },
  hero: {
    scrollHint: "Scroll to explore",
    resumeAria: "Open resume PDF",
    githubAria: "GitHub profile",
  },
  stack: {
    eyebrow: "Stack",
    title: "Tools I ship with",
    subtitle: "From frontend polish to deployment pipelines",
    groups: {
      languages: "Languages & Frameworks",
      database: "Database & ORM",
      infrastructure: "Infrastructure",
      other: "Other",
    },
    otherItems: {
      englishB1: "English B1",
      crossPlatform: "Cross-platform software",
      qa: "QA Engineering",
      devops: "DevOps",
      restApis: "REST APIs",
    },
  },
  cases: {
    eyebrow: "Commercial Experience",
    title: "Case studies",
    viewCase: "View case →",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something",
    subtitle: "Open to freelance, full-time roles, and interesting product work.",
    email: "Email",
    phone: "Phone",
    telegram: "Telegram",
    sendMessage: "Send a message",
    form: {
      eyebrow: "Contact",
      title: "Send a message",
      close: "Close",
      closeAria: "Close contact form",
      name: "Name",
      message: "Message",
      submit: "Open in Telegram",
      successTitle: "Telegram opened.",
      successBody: "Tap Send in Telegram to deliver your message.",
      validation: {
        name: "Enter your name (2–80 characters).",
        message: "Enter a message.",
      },
      telegramGreeting: "Hi! I'm {name}.",
    },
  },
  caseModal: {
    close: "Close",
    closeAria: "Close case",
    visitLive: "Visit live site",
  },
  languageToggle: {
    ariaLabel: "Switch to Russian",
  },
};
