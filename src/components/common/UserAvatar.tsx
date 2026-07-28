import React, { useState } from 'react';

interface UserAvatarProps {
  name?: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'U';
  const cleanName = name.trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  avatar,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm font-bold',
    xl: 'w-24 h-24 text-2xl font-bold',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  const hasAvatarUrl = avatar && typeof avatar === 'string' && avatar.trim().length > 0;

  if (hasAvatarUrl && !imageError) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${currentSizeClass} rounded-full object-cover border border-[#E5E2DA] bg-slate-100 ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <div
      className={`${currentSizeClass} rounded-full bg-[#8A9A5B] text-white font-bold flex items-center justify-center shrink-0 border border-[#78884B] select-none ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
