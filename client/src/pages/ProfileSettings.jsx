import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, Lock, Bell, Moon, HelpCircle, Info, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile, updateSettings } from "../services/userService";
import { getDashboard } from "../services/dashboardService";

import ProfileCard from "../components/profile/ProfileCard";
import ActivityStats from "../components/profile/ActivityStats";
import SettingsSection from "../components/profile/SettingsSection";
import SettingsItem from "../components/profile/SettingsItem";
import ToggleSetting from "../components/profile/ToggleSetting";
import LogoutButton from "../components/profile/LogoutButton";
import EditProfileForm from "../components/profile/EditProfileForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";
import Dialog from "../components/ui/Dialog";

function ProfileSettings() {
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();

  // Profile API State
  const [profile, setProfile] = useState(null);
  const [activityStats, setActivityStats] = useState({
    totalScans: 0,
    recyclable: 0,
    other: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);

  // Local UI state (instant toggle before API finishes)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, dashboardData] = await Promise.all([
          getProfile(),
          getDashboard()
        ]);
        
        setProfile(profileData.user);
        updateUser(profileData.user);
        
        if (dashboardData.success) {
          const metrics = dashboardData.metrics;
          setActivityStats({
            totalScans: metrics.totalScans || 0,
            recyclable: metrics.recyclable || 0,
            other: (metrics.totalScans || 0) - (metrics.recyclable || 0),
          });
        }
        
        // Sync local dark mode state with DB
        if (profileData.user?.darkMode) {
          setDarkModeEnabled(true);
        }
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdateProfile = async (formData) => {
    try {
      setSaving(true);
      setError("");

      const data = await updateProfile(formData);
      setProfile(data.user);
      
      // Update the global AuthContext user so header/sidebar reflect changes immediately
      updateUser(data.user);

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (!profile) return;
    const newValue = !(profile.notifications ?? true);
    
    // Optimistic update
    setProfile(prev => ({ 
      ...prev, 
      notifications: newValue
    }));
    
    try {
      const data = await updateSettings({
        notifications: newValue,
      });
      setProfile(data.user);
      updateUser(data.user);
    } catch (error) {
      console.error(error);
      // Revert on error
      setProfile(prev => ({ 
        ...prev, 
        notifications: !newValue
      }));
      setError(error.response?.data?.message || "Unable to update setting.");
    }
  };

  const handleToggleDarkMode = async () => {
    if (!profile) return;
    const newValue = !darkModeEnabled;
    
    setDarkModeEnabled(newValue); // updates UI instantly
    
    try {
      const data = await updateSettings({
        darkMode: newValue,
      });
      setProfile(data.user);
      updateUser(data.user);
    } catch (error) {
      console.error(error);
      setDarkModeEnabled(!newValue); // revert on error
      setError(error.response?.data?.message || "Unable to update setting.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-surface-page pb-10">
        <div className="sticky top-0 z-30 bg-surface-card border-b border-border-default px-5 py-4 flex flex-col gap-1 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D8E6DD] animate-pulse" />
            <div className="w-24 h-6 rounded bg-[#D8E6DD] animate-pulse" />
          </div>
        </div>
        <main className="px-5 py-6 lg:px-12 lg:py-10 max-w-[800px] mx-auto flex flex-col gap-6">
          <div className="w-full h-[240px] rounded-[24px] bg-[#D8E6DD] animate-pulse opacity-50" />
          <div className="w-full h-[120px] rounded-xl bg-[#D8E6DD] animate-pulse opacity-50" />
          <div className="w-full h-[200px] rounded-[24px] bg-[#D8E6DD] animate-pulse opacity-50" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page pb-10">
      
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 bg-surface-card border-b border-border-default px-5 py-4 flex flex-col gap-1 lg:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="text-text-muted hover:text-text-primary p-1 -ml-1 rounded transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-semibold text-text-primary">Profile</span>
        </div>
      </div>

      <main className="px-5 py-6 lg:px-12 lg:py-10 max-w-[800px] mx-auto">
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
          
          {error && (
            <div className="p-4 rounded-xl bg-error-bg border border-error-text flex items-start gap-3">
              <div className="text-error-text font-semibold shrink-0">!</div>
              <div className="flex flex-col">
                <p className="text-sm text-error-text font-medium leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Header (Mobile + Desktop) */}
          <ProfileCard 
            name={profile?.name} 
            email={profile?.email} 
            avatar={profile?.avatar}
            onEditClick={() => setIsEditModalOpen(true)} 
          />

          {/* Activity */}
          <ActivityStats stats={activityStats} />

          {/* Settings Group */}
          <div className="flex flex-col gap-6">
            
            <SettingsSection title="Account">
              <SettingsItem 
                icon={UserRound} 
                title="Edit Profile" 
                onClick={() => setIsEditModalOpen(true)} 
              />
              <SettingsItem 
                icon={Lock} 
                title="Change Password" 
                onClick={() => setIsPasswordModalOpen(true)} 
              />
            </SettingsSection>

            <SettingsSection title="Preferences">
              <SettingsItem 
                icon={Bell} 
                title="Notifications" 
                control={<ToggleSetting isEnabled={profile?.notifications ?? true} onToggle={handleToggleNotifications} />} 
              />
              <SettingsItem 
                icon={Moon} 
                title="Dark Mode" 
                control={<ToggleSetting isEnabled={darkModeEnabled} onToggle={handleToggleDarkMode} />} 
              />
            </SettingsSection>

            <SettingsSection title="App">
              <SettingsItem 
                icon={HelpCircle} 
                title="Help & Support" 
                onClick={() => setOpenDialog('help')} 
              />
              <SettingsItem 
                icon={Info} 
                title="About WasteWise AI" 
                value="Version 1.0.0"
                onClick={() => setOpenDialog('about')} 
              />
              <SettingsItem 
                icon={ShieldCheck} 
                title="Privacy Policy" 
                onClick={() => setOpenDialog('privacy')} 
              />
            </SettingsSection>

          </div>

          {/* Logout */}
          <div className="mt-4 pb-8">
            <LogoutButton onLogout={handleLogout} />
          </div>

        </div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileForm 
          initialName={profile?.name}
          initialEmail={profile?.email}
          initialAvatar={profile?.avatar}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateProfile}
          isSaving={saving}
        />
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <ChangePasswordForm onClose={() => setIsPasswordModalOpen(false)} />
      )}

      {/* App Info Dialogs */}
      <Dialog 
        open={openDialog === 'help'} 
        onClose={() => setOpenDialog(null)}
        title="Help & Support"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted leading-relaxed">
            Need assistance with WasteWise AI? Our support team is here to help you correctly identify and dispose of your waste.
          </p>
          <div className="bg-surface-page p-4 rounded-xl border border-border-default">
            <h4 className="text-sm font-semibold text-text-primary mb-1">Email Support</h4>
            <a href="mailto:support@wastewise.ai" className="text-sm text-brand font-medium hover:underline">
              support@wastewise.ai
            </a>
          </div>
          <button 
            onClick={() => setOpenDialog(null)}
            className="w-full py-2.5 bg-surface-page hover:bg-border-default text-text-primary text-sm font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </Dialog>

      <Dialog 
        open={openDialog === 'about'} 
        onClose={() => setOpenDialog(null)}
        title="About WasteWise AI"
      >
        <div className="space-y-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-2">
            <ShieldCheck size={32} />
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            WasteWise AI is a smart sustainability app built to help you dispose of waste correctly using artificial intelligence.
          </p>
          <p className="text-xs text-text-muted font-medium bg-surface-page px-3 py-1 rounded-full border border-border-default">
            Version 1.0.0
          </p>
        </div>
      </Dialog>

      <Dialog 
        open={openDialog === 'privacy'} 
        onClose={() => setOpenDialog(null)}
        title="Privacy Policy"
      >
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          <p className="text-sm text-text-muted leading-relaxed">
            Your privacy is important to us. WasteWise AI only collects data necessary for core application functionality.
          </p>
          <h4 className="text-sm font-semibold text-text-primary">Data We Collect</h4>
          <p className="text-sm text-text-muted leading-relaxed">
            We store your profile information (name, email) and images you explicitly submit for scanning to train our models and maintain your history.
          </p>
          <h4 className="text-sm font-semibold text-text-primary">Data Security</h4>
          <p className="text-sm text-text-muted leading-relaxed">
            All data is encrypted in transit and at rest. We do not sell your personal data to third parties.
          </p>
        </div>
      </Dialog>

    </div>
  );
}

export default ProfileSettings;
