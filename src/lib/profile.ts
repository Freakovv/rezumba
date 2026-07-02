export const profile = {
  name: "Mikhail",
  surname: "Simanovich",
  location: "Belarus, Minsk",
  email: "misha.simanovich@mail.ru",
  phone: "+375 25 667 81 28",
  website: "rezumba.xyz",
  telegram: "@sskkywalker",
  resumePdf: "/CV.pdf",
} as const;

export const stack = {
  languages: [
    "C++",
    "C#",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Vite",
    "Tailwind CSS",
  ],
  database: [
    "Microsoft SQL Server",
    "PostgreSQL",
    "MySQL",
    "Prisma",
    "Drizzle",
  ],
  infrastructure: ["Docker", "Linux", "VPS", "nginx", "Git", "CI/CD"],
} as const;
