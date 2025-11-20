'use client';

import React, { ReactNode } from 'react';

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children
}) => {
  return <>{children}</>;
};

export default NotificationProvider;