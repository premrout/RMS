
import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import PricingPlans from './super-admin/PricingPlans';
import TenantManager from './super-admin/TenantManager';
import AuditLogs from './super-admin/AuditLogs';
import BillingManager from './super-admin/BillingManager';
import GlobalSettings from './super-admin/GlobalSettings';
import PlatformAnalytics from './super-admin/PlatformAnalytics';
import AdminManager from './super-admin/AdminManager';
import DeveloperTools from './super-admin/DeveloperTools';
import NotificationManager from './super-admin/NotificationManager';
import ContentManager from './super-admin/ContentManager';
import SupportTickets from './super-admin/SupportTickets';
import IntegrationsManager from './super-admin/IntegrationsManager';
import RolesManager from './super-admin/RolesManager';
import SuperAdminOverview from './super-admin/SuperAdminOverview';
import FeatureFlags from './super-admin/FeatureFlags';
import { User } from '../types';

interface SuperAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('SA_OVERVIEW');

  // Sync with URL params for deep linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const saView = params.get('sa_view');
    if (saView) {
        setActiveView(saView);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeView) {
        params.set('sa_view', activeView);
        params.set('page', 'SUPER_ADMIN'); // Ensure page context is preserved
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }
  }, [activeView]);

  return (
    <SuperAdminLayout 
      user={user} 
      onLogout={onLogout} 
      activeView={activeView} 
      setActiveView={setActiveView}
    >
      
      {activeView === 'SA_OVERVIEW' && <SuperAdminOverview setActiveView={setActiveView} />}
      {activeView === 'SA_ANALYTICS' && <PlatformAnalytics />}
      {activeView === 'SA_PLANS' && <PricingPlans />}
      {activeView === 'SA_TENANTS' && <TenantManager />}
      {activeView === 'SA_ADMINS' && <AdminManager />}
      {activeView === 'SA_ROLES' && <RolesManager />}
      {activeView === 'SA_BILLING' && <BillingManager />}
      {activeView === 'SA_NOTIFICATIONS' && <NotificationManager />}
      {activeView === 'SA_CMS' && <ContentManager />}
      {activeView === 'SA_SETTINGS' && <GlobalSettings />}
      {activeView === 'SA_FLAGS' && <FeatureFlags />}
      {activeView === 'SA_LOGS' && <AuditLogs />}
      {activeView === 'SA_SUPPORT' && <SupportTickets />}
      {activeView === 'SA_INTEGRATIONS' && <IntegrationsManager />}
      {activeView === 'SA_DEVELOPER' && <DeveloperTools />}

    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
