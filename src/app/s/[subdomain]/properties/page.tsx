import PropertiesPageClientSimple from "@/components/websites/templates/template_1/sections/list/PropertiesPageClientSimple";

interface PropertyPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function ListPage({ params }: PropertyPageProps) {
  const { subdomain } = await params;

  return <PropertiesPageClientSimple subdomain={subdomain} />;
}
