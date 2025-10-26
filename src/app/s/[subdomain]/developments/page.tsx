
import DevelopmentsPage from "@/components/websites/templates/template_1/sections/developments/DevelopmentsPage";


interface DevelopmentsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}
export default async function DevelopmentPage({params}:DevelopmentsPageProps) {
  const { subdomain } = await params;
  return <>
  <DevelopmentsPage subdomain={subdomain}/>
  </>;
}