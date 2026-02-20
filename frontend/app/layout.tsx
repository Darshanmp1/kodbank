import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KodBank - Your Digital Banking Partner',
  description: 'Secure and modern banking application built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
