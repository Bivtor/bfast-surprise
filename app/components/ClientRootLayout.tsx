'use client';

import EditModalProvider from '../components/EditModalProvider';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <EditModalProvider />
    </>
  );
}
