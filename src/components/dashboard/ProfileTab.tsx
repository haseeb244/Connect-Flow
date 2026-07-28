import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  User as UserIcon, 
  Upload, 
  Trash2, 
  Check, 
  AlertCircle, 
  Loader2, 
  Save, 
  Phone, 
  Mail, 
  Shield 
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { currentUser, updateUserProfile, addNotification } = useApp();

  const [fullName, setFullName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setPhone(currentUser.phone || '');
  }, [currentUser]);

  // Handle Photo Upload
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate Image Type (JPG, PNG, WEBP)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Invalid file format. Please upload a JPG, PNG, or WEBP image.');
      setSuccessMessage('');
      if (e.target) e.target.value = '';
      return;
    }

    // 2. Validate Image Size (Max 5 MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('Image size exceeds 5 MB limit. Please select a smaller photo.');
      setSuccessMessage('');
      if (e.target) e.target.value = '';
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let publicUrl = '';

      if (isSupabaseConfigured && supabase) {
        // Ensure "avatars" bucket exists
        try {
          await supabase.storage.createBucket('avatars', { public: true });
        } catch {
          // bucket may already exist
        }

        // Clean up previous images for this user in Storage if any
        try {
          const { data: existingFiles } = await supabase.storage.from('avatars').list(currentUser.id);
          if (existingFiles && existingFiles.length > 0) {
            const pathsToRemove = existingFiles.map(f => `${currentUser.id}/${f.name}`);
            await supabase.storage.from('avatars').remove(pathsToRemove);
          }
        } catch {
          // ignore error if user folder does not exist yet
        }

        // Generate unique file path
        const fileExt = file.name.split('.').pop() || 'png';
        const filePath = `${currentUser.id}/avatar-${Date.now()}.${fileExt}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { 
            upsert: true,
            contentType: file.type,
            cacheControl: '3600'
          });

        if (uploadError) {
          throw new Error(`Storage Upload Error: ${uploadError.message}`);
        }

        // Obtain public image URL
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;

        // Save public image URL in users.avatar column in Supabase PostgreSQL
        const { error: dbError } = await supabase
          .from('users')
          .update({ avatar: publicUrl })
          .eq('id', currentUser.id);

        if (dbError) {
          // If update fails (e.g. user record missing), attempt upsert
          await supabase.from('users').upsert({
            id: currentUser.id,
            name: fullName,
            email: email,
            phone: phone,
            role: currentUser.role,
            businessId: currentUser.businessId,
            businessName: currentUser.businessName,
            avatar: publicUrl,
            status: currentUser.status || 'active',
            createdAt: currentUser.createdAt || new Date().toISOString()
          });
        }
      } else {
        // Local preview fallback if Supabase credentials are missing
        publicUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Immediately update global user profile state across Header, Dropdown, and Profile page
      await updateUserProfile({ avatar: publicUrl });

      setSuccessMessage('Profile photo uploaded and saved successfully!');
      addNotification({
        title: 'Profile Photo Updated',
        message: 'Your profile photo has been updated and synced to your account.',
        type: 'success',
        timestamp: 'Just now',
        linkTab: 'profile',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    if (!currentUser.avatar) return;

    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        // Delete user's images from Supabase Storage avatars bucket
        try {
          const { data: fileList } = await supabase.storage.from('avatars').list(currentUser.id);
          if (fileList && fileList.length > 0) {
            const filesToRemove = fileList.map(f => `${currentUser.id}/${f.name}`);
            await supabase.storage.from('avatars').remove(filesToRemove);
          }
        } catch {
          // ignore if folder was missing
        }

        // Set avatar column to null in users table in Supabase
        await supabase
          .from('users')
          .update({ avatar: null })
          .eq('id', currentUser.id);
      }

      // Update state to switch back to Initials avatar
      await updateUserProfile({ avatar: '' });

      setSuccessMessage('Profile photo removed. Reverted to initials avatar.');
      addNotification({
        title: 'Profile Photo Removed',
        message: 'Your photo was removed and replaced with your initials avatar.',
        type: 'info',
        timestamp: 'Just now',
        linkTab: 'profile',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Form Submission (Full Name, Email Address, Phone Number)
  const handleSaveProfileInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: dbError } = await supabase
          .from('users')
          .update({
            name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          })
          .eq('id', currentUser.id);

        if (dbError) {
          throw new Error(dbError.message);
        }
      }

      await updateUserProfile({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      setSuccessMessage('Profile details saved successfully!');
      addNotification({
        title: 'Profile Updated',
        message: 'Your contact credentials have been updated.',
        type: 'success',
        timestamp: 'Just now',
        linkTab: 'profile',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasPhoto = Boolean(currentUser.avatar && currentUser.avatar.trim().length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DA]">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D302D] tracking-tight">My Profile</h2>
          <p className="text-xs text-[#8A857C] mt-0.5">
            Manage your personal credentials, contact information, and account profile photo.
          </p>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-3 animate-in fade-in">
          <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
            <Check className="w-4 h-4" />
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-3 animate-in fade-in">
          <div className="p-1.5 bg-rose-600 text-white rounded-lg">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DA] shadow-2xs space-y-8">
        {/* Profile Photo Section */}
        <div className="space-y-4 pb-6 border-b border-[#F2F0EB]">
          <div>
            <h3 className="text-sm font-bold text-[#2D302D]">Profile Photo</h3>
            <p className="text-xs text-[#8A857C] mt-0.5">
              Upload a custom profile image or use your colored initials avatar. Supports JPG, PNG, and WEBP formats up to 5 MB.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Current Avatar Preview */}
            <div className="relative group shrink-0">
              <UserAvatar 
                name={fullName || currentUser.name} 
                avatar={currentUser.avatar} 
                size="xl" 
                className="shadow-sm"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            {/* Photo Action Controls */}
            <div className="space-y-3 text-center sm:text-left w-full sm:w-auto">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {/* Upload Profile Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2.5 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Upload Profile Photo</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {/* Remove Photo Button */}
                {hasPhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isUploading}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 disabled:opacity-50 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-[#8A857C]">
                {hasPhoto 
                  ? 'Your uploaded photo is stored securely in Supabase Storage.' 
                  : 'No custom photo uploaded. Displaying colored initials avatar by default.'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <form onSubmit={handleSaveProfileInfo} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#2D302D] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-[#E5E2DA] focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] rounded-xl text-xs font-semibold text-[#2D302D] outline-none transition-all bg-[#F9F8F6]/50 focus:bg-white"
                />
                <UserIcon className="w-4 h-4 text-[#8A857C] absolute left-3 top-3" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#2D302D] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-[#E5E2DA] focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] rounded-xl text-xs font-semibold text-[#2D302D] outline-none transition-all bg-[#F9F8F6]/50 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-[#8A857C] absolute left-3 top-3" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#2D302D] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-[#E5E2DA] focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] rounded-xl text-xs font-mono text-[#2D302D] outline-none transition-all bg-[#F9F8F6]/50 focus:bg-white"
                />
                <Phone className="w-4 h-4 text-[#8A857C] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* User Role Badges & Save Action Footer */}
          <div className="pt-4 border-t border-[#F2F0EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#8A857C]">
              <Shield className="w-4 h-4 text-[#8A9A5B]" />
              <span>Role: <strong className="text-[#2D302D] uppercase">{currentUser.role || 'Business Admin'}</strong></span>
              <span>&bull;</span>
              <span>ID: <code className="bg-[#F2F0EB] px-2 py-0.5 rounded text-[10px] font-mono text-[#2D302D]">{currentUser.id}</code></span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
