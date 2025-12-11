
import React, { useState, useEffect } from 'react';
import { 
  Save, Globe, Shield, Mail, CreditCard, Server, AlertTriangle, 
  CheckCircle, Loader2, Lock, Eye, EyeOff, Terminal
} from 'lucide-react';
import { api } from '../../services/api';
import { SystemSettings } from '../../types';

const GlobalSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'EMAIL'>('GENERAL');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  
  const [settings, setSettings] = useState<SystemSettings>({
    platformName: 'RevOpRMS',
    supportEmail: 'support@revoprms.com',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultCurrency: 'INR',
    minPasswordLength: 8,
    sessionTimeout: 60,
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUser: 'apikey',
    razorpayKeyId: 'rzp_test_1234567890',
    geminiApiKey: 'AIzaSy...'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSystemSettings();
      if (data) setSettings(data);
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSystemSettings(settings);
      // Simulate delay
      await new Promise(r => setTimeout(r, 800));
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder, helpText, isSecret }: any) => (
    <div className="space-y-1">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        <input 
          type={isSecret && !showSecrets[label] ? "password" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {isSecret && (
          <button 
            type="button"
            onClick={() => toggleSecret(label)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showSecrets[label] ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  );

  const Toggle = ({ label, checked, onChange, helpText, danger }: any) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${danger ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-200'}`}>
      <div>
         <p className={`font-bold text-sm ${danger ? 'text-rose-800' : 'text-slate-800'}`}>{label}</p>
         {helpText && <p className={`text-xs mt-1 ${danger ? 'text-rose-600' : 'text-slate-500'}`}>{helpText}</p>}
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked 
            ? (danger ? 'bg-rose-500' : 'bg-indigo-600') 
            : 'bg-slate-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Web App Settings</h2>
           <p className="text-sm text-slate-500">Configure global platform parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Settings Sidebar */}
         <div className="w-full lg:w-64 flex flex-col gap-2">
            {[
              { id: 'GENERAL', label: 'General', icon: Globe },
              { id: 'SECURITY', label: 'Security & Access', icon: Shield },
              { id: 'EMAIL', label: 'Email & SMTP', icon: Mail },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                   activeTab === tab.id 
                   ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                   : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                 <tab.icon size={18} /> {tab.label}
              </button>
            ))}
         </div>

         {/* Settings Content */}
         <div className="flex-1 space-y-6">
            
            {/* --- GENERAL TAB --- */}
            {activeTab === 'GENERAL' && (
              <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Platform Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputField 
                          label="Platform Name" 
                          value={settings.platformName} 
                          onChange={(v: string) => setSettings({...settings, platformName: v})} 
                       />
                       <InputField 
                          label="Support Email" 
                          value={settings.supportEmail} 
                          onChange={(v: string) => setSettings({...settings, supportEmail: v})} 
                       />
                       <InputField 
                          label="Default Currency" 
                          value={settings.defaultCurrency} 
                          onChange={(v: string) => setSettings({...settings, defaultCurrency: v})} 
                       />
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Operational Controls</h3>
                    <Toggle 
                       label="Allow New Registrations" 
                       checked={settings.allowRegistrations} 
                       onChange={(v: boolean) => setSettings({...settings, allowRegistrations: v})}
                       helpText="If disabled, the sign-up page will be hidden from the public."
                    />
                    <Toggle 
                       label="Maintenance Mode" 
                       checked={settings.maintenanceMode} 
                       onChange={(v: boolean) => setSettings({...settings, maintenanceMode: v})}
                       helpText="When enabled, only Super Admins can access the system. Tenants will see a maintenance page."
                       danger
                    />
                 </div>
              </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'SECURITY' && (
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Security Policies</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Min Password Length" 
                        type="number"
                        value={settings.minPasswordLength} 
                        onChange={(v: string) => setSettings({...settings, minPasswordLength: parseInt(v)})} 
                      />
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Session Timeout (Minutes)</label>
                        <select 
                           value={settings.sessionTimeout}
                           onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                           <option value={15}>15 Minutes</option>
                           <option value={30}>30 Minutes</option>
                           <option value={60}>1 Hour</option>
                           <option value={240}>4 Hours</option>
                           <option value={1440}>24 Hours</option>
                        </select>
                      </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-start gap-3">
                         <Shield className="text-indigo-600 mt-1" size={20} />
                         <div>
                            <h4 className="font-bold text-slate-800 text-sm">Two-Factor Authentication (2FA)</h4>
                            <p className="text-xs text-slate-500 mt-1 mb-3">Enforce 2FA for all administrative accounts (Tenant Admins & Super Admins).</p>
                            <label className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                               <span className="text-sm font-medium text-slate-700">Enforce Global 2FA</span>
                            </label>
                         </div>
                      </div>
                  </div>
               </div>
            )}

            {/* --- EMAIL TAB --- */}
            {activeTab === 'EMAIL' && (
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                     <Server size={18}/> SMTP Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                         <InputField 
                            label="SMTP Host" 
                            value={settings.smtpHost} 
                            onChange={(v: string) => setSettings({...settings, smtpHost: v})} 
                            placeholder="e.g. smtp.sendgrid.net"
                         />
                      </div>
                      <InputField 
                            label="SMTP Port" 
                            type="number"
                            value={settings.smtpPort} 
                            onChange={(v: string) => setSettings({...settings, smtpPort: parseInt(v)})} 
                      />
                      <InputField 
                            label="SMTP Username" 
                            value={settings.smtpUser} 
                            onChange={(v: string) => setSettings({...settings, smtpUser: v})} 
                      />
                      <div className="md:col-span-2">
                         <InputField 
                            label="SMTP Password / API Key" 
                            value="************************"
                            onChange={() => {}} 
                            isSecret
                         />
                      </div>
                  </div>

                  <div className="flex justify-end">
                      <button className="text-sm font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                         Send Test Email
                      </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
