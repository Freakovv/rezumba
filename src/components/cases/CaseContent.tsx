import { MDXRemote } from "next-mdx-remote/rsc";
import { getCaseContent } from "@/lib/cases";
import { getServerLocale } from "@/lib/get-server-locale";
import { CaseModal } from "@/components/ui/CaseModal";

type CaseContentProps = {
  slug: string;
};

export async function CaseContent({ slug }: CaseContentProps) {
  const locale = await getServerLocale();
  const { meta, content } = getCaseContent(slug, locale);
  const mdx = <MDXRemote source={content} />;

  return (
    <CaseModal
      title={meta.title}
      subtitle={meta.subtitle}
      year={meta.year}
      tags={meta.tags}
      href={meta.href}
    >
      {mdx}
    </CaseModal>
  );
}
