import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import CertificatesPage from "@/pages/CertificatesPage";
import LanguagesPage from "@/pages/LanguagesPage";
import MyPowerPage from "@/pages/MyPowerPage";
import BrainPowerPage from "@/pages/BrainPowerPage";
import ResumePage from "@/pages/ResumePage";
import InternshipsPage from "@/pages/InternshipsPage";
import LinkedProfilePage from "@/pages/LinkedProfilePage";
import CareerGuidancePage from "@/pages/CareerGuidancePage";
import LinkedProfilePage from "@/pages/LinkedProfilePage";

const pages: Record<string, React.FC> = {
  dashboard: DashboardPage,
  profile: ProfilePage,
  certificates: CertificatesPage,
  languages: LanguagesPage,
  mypower: MyPowerPage,
  brainpower: BrainPowerPage,
  resume: ResumePage,
  internships: InternshipsPage,
  linked: LinkedProfilePage,
};

export default function Index() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const PageComponent = pages[activeTab] || DashboardPage;

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <PageComponent />
    </AppLayout>
  );
}
