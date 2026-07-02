import { getAllCases } from "@/lib/cases";
import { HomeScrollExperience } from "@/components/home/HomeScrollExperience";

export default function Home() {
  const casesByLocale = {
    en: getAllCases("en"),
    ru: getAllCases("ru"),
  };

  return <HomeScrollExperience casesByLocale={casesByLocale} />;
}
