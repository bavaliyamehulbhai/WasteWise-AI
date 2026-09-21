import { useState, useEffect } from "react";
import { Save, Bell, Shield, Database, Layout, Moon, Sun, Cpu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [settings, setSettings] = useState({
    platformName: "WasteWise OS",
    supportEmail: "support@wastewise.ai",
    darkMode: true,
    enableNotifications: true,
    require2FA: false,
    sessionTimeout: "60",
    aiModel: "groq-llama-3",
    confidenceThreshold: "75",
    gamificationEnabled: true,
    xpMultiplier: "1.0",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings");
        if (res.data?.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Live preview for Dark Mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put("/admin/settings", settings);
      if (res.data?.success) {
        setSuccessMsg("Settings saved successfully!");
        
        // Also apply it to the current user so it sticks across the app
        updateUser({ ...user, darkMode: settings.darkMode });
        
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Layout },
    { id: "ai", label: "AI Configuration", icon: Cpu },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Platform Settings</h1>
          <p className="text-text-muted mt-2">Manage WasteWise OS configuration and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl font-medium flex items-center">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id
                  ? "bg-brand/10 text-brand border border-brand/20"
                  : "text-text-secondary hover:bg-surface-card border border-transparent"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Layout className="text-brand" /> General Settings
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full bg-surface-page border border-border-default text-text-primary px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Support Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full bg-surface-page border border-border-default text-text-primary px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-border-default">
                  <div>
                    <h4 className="font-medium text-text-primary">Dark Mode Default</h4>
                    <p className="text-sm text-text-muted">Force dark mode for all new administrative users.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-card peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Cpu className="text-purple-500" /> AI Configuration
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Active Vision Model</label>
                  <select
                    value={settings.aiModel}
                    onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                    className="w-full bg-surface-page border border-border-default text-text-primary px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
                  >
                    <option value="groq-llama-3">Groq (Llama 3 Vision)</option>
                    <option value="openai-gpt4o">OpenAI (GPT-4o)</option>
                    <option value="gemini-1.5-pro">Google (Gemini 1.5 Pro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Confidence Threshold (%)</label>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={settings.confidenceThreshold}
                    onChange={(e) => setSettings({ ...settings, confidenceThreshold: e.target.value })}
                    className="w-full accent-brand"
                  />
                  <div className="text-right text-sm font-bold text-brand mt-1">{settings.confidenceThreshold}%</div>
                  <p className="text-xs text-text-muted mt-2">Scans below this threshold will be flagged for manual review.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Shield className="text-red-500" /> Security Policies
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-border-default">
                  <div>
                    <h4 className="font-medium text-text-primary">Require 2FA</h4>
                    <p className="text-sm text-text-muted">Enforce Two-Factor Authentication for all admin accounts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.require2FA}
                      onChange={(e) => setSettings({ ...settings, require2FA: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-card peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Session Timeout (minutes)</label>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="w-full bg-surface-page border border-border-default text-text-primary px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="1440">24 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-surface-card border border-border-default rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Bell className="text-yellow-500" /> Notification Preferences
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-surface-page rounded-xl border border-border-default">
                  <div>
                    <h4 className="font-medium text-text-primary">System Alerts</h4>
                    <p className="text-sm text-text-muted">Receive email alerts for critical system errors.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-card peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
