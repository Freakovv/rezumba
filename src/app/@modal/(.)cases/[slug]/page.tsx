import { CaseContent } from "@/components/cases/CaseContent";

type InterceptedCasePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterceptedCasePage({
  params,
}: InterceptedCasePageProps) {
  const { slug } = await params;
  return <CaseContent slug={slug} />;
}
