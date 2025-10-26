// components/admin/UserAvatar.tsx
'use client'

interface UserAvatarProps {
  firstName?: string
  lastName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ 
  firstName, 
  lastName, 
  size = 'md',
  className = '' 
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  }

  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`

  return (
    <div className={`
      ${sizeClasses[size]} 
      rounded-full bg-red-600 flex items-center justify-center text-white font-medium shadow-sm
      ${className}
    `}>
      {initials}
    </div>
  )
}
