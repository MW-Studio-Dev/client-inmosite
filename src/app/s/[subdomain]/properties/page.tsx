import PropertiesPage from "@/components/websites/templates/template_1/sections/list/PropertiesPage";


interface PropertyPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}
export default async function ListPage({params}: PropertyPageProps) {
  const { subdomain } = await params;
  console.log(subdomain)
  return <PropertiesPage subdomain={subdomain}/>;
}