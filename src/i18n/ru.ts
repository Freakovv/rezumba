import type { Messages } from "./types";

export const ru: Messages = {
  profile: {
    title: "Веб-разработчик",
    firstName: "Михаил",
    lastName: "Симанович",
  },
  nav: {
    about: "Обо мне",
    stack: "Стек",
    experience: "Опыт",
    contact: "Контакты",
  },
  hero: {
    scrollHint: "Листайте вниз",
    resumeAria: "Открыть резюме PDF",
    githubAria: "Профиль на GitHub",
  },
  stack: {
    eyebrow: "Стек",
    title: "Инструменты в продакшене",
    subtitle: "От фронтенда до деплоя",
    groups: {
      languages: "Языки и фреймворки",
      database: "База данных и ORM",
      infrastructure: "Инфраструктура",
      other: "Прочее",
    },
    otherItems: {
      englishB1: "Английский B1",
      crossPlatform: "Кроссплатформенная разработка",
      qa: "QA-инженерия",
      devops: "DevOps",
      restApis: "REST API",
    },
  },
  cases: {
    eyebrow: "Коммерческий опыт",
    title: "Кейсы",
    viewCase: "Подробнее →",
  },
  contact: {
    eyebrow: "Контакты",
    title: "Давайте создадим что-то вместе",
    subtitle: "Открыт к фрилансу, full-time и интересным продуктовым задачам.",
    email: "Email",
    phone: "Телефон",
    telegram: "Telegram",
    sendMessage: "Написать сообщение",
    form: {
      eyebrow: "Контакты",
      title: "Написать сообщение",
      close: "Закрыть",
      closeAria: "Закрыть форму контактов",
      name: "Имя",
      message: "Сообщение",
      submit: "Открыть в Telegram",
      successTitle: "Telegram открыт.",
      successBody: "Нажмите «Отправить» в Telegram, чтобы доставить сообщение.",
      validation: {
        name: "Введите имя (2–80 символов).",
        message: "Введите сообщение.",
      },
      telegramGreeting: "Привет! Меня зовут {name}.",
    },
  },
  caseModal: {
    close: "Закрыть",
    closeAria: "Закрыть кейс",
    visitLive: "Открыть сайт",
  },
  languageToggle: {
    ariaLabel: "Переключить на английский",
  },
};
