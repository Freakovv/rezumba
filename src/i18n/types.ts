export type Locale = "en" | "ru";

export type Messages = {
  profile: {
    title: string;
    firstName: string;
    lastName: string;
  };
  nav: {
    about: string;
    stack: string;
    experience: string;
    contact: string;
  };
  hero: {
    scrollHint: string;
    resumeAria: string;
    githubAria: string;
  };
  stack: {
    eyebrow: string;
    title: string;
    subtitle: string;
    groups: {
      languages: string;
      database: string;
      infrastructure: string;
      other: string;
    };
    otherItems: {
      englishB1: string;
      crossPlatform: string;
      qa: string;
      devops: string;
      restApis: string;
    };
  };
  cases: {
    eyebrow: string;
    title: string;
    viewCase: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    telegram: string;
    sendMessage: string;
    form: {
      eyebrow: string;
      title: string;
      close: string;
      closeAria: string;
      name: string;
      message: string;
      submit: string;
      successTitle: string;
      successBody: string;
      validation: {
        name: string;
        message: string;
      };
      telegramGreeting: string;
    };
  };
  caseModal: {
    close: string;
    closeAria: string;
    visitLive: string;
  };
  languageToggle: {
    ariaLabel: string;
  };
};
