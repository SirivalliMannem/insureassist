import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerPolicies from './pages/CustomerPolicies';
import CustomerApplication from './pages/CustomerApplication';
import CustomerComparison from './pages/CustomerComparison';
import CustomerCoverage from './pages/CustomerCoverage';
import CustomerGlossary from './pages/CustomerGlossary';
import CustomerClaim from './pages/CustomerClaim';
import CustomerClaims from './pages/CustomerClaims';
import CustomerAi from './pages/CustomerAi';
import CustomerProfile from './pages/CustomerProfile';
import AgentDashboard from './pages/AgentDashboard';
import AgentCustomers from './pages/AgentCustomers';
import AgentPolicies from './pages/AgentPolicies';
import AgentApplications from './pages/AgentApplications';
import AgentAi from './pages/AgentAi';
import AgentProfile from './pages/AgentProfile';
import UnderwriterDashboard from './pages/UnderwriterDashboard';
import UnderwriterQueue from './pages/UnderwriterQueue';
import UnderwriterRisk from './pages/UnderwriterRisk';
import UnderwriterReview from './pages/UnderwriterReview';
import UnderwriterAi from './pages/UnderwriterAi';
import UnderwriterProfile from './pages/UnderwriterProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import AdminPolicies from './pages/AdminPolicies';
import AdminAudit from './pages/AdminAudit';
import AdminAi from './pages/AdminAi';
import AdminProfile from './pages/AdminProfile';

export default function AppShell() {
  return (
    <div id="app">
      <Sidebar />
      <div className="main-wrapper">
        <TopHeader />
        <main className="main-content">
          <CustomerDashboard />
          <CustomerPolicies />
          <CustomerApplication />
          <CustomerComparison />
          <CustomerCoverage />
          <CustomerGlossary />
          <CustomerClaim />
          <CustomerClaims />
          <CustomerAi />
          <CustomerProfile />
          <AgentDashboard />
          <AgentCustomers />
          <AgentPolicies />
          <AgentApplications />
          <AgentAi />
          <AgentProfile />
          <UnderwriterDashboard />
          <UnderwriterQueue />
          <UnderwriterRisk />
          <UnderwriterReview />
          <UnderwriterAi />
          <UnderwriterProfile />
          <AdminDashboard />
          <AdminUsers />
          <AdminRoles />
          <AdminPolicies />
          <AdminAudit />
          <AdminAi />
          <AdminProfile />
        </main>
      </div>
    </div>
  );
}
