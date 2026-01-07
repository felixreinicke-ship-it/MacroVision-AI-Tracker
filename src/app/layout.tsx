// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MacroVision',
  description: 'MacroVision – dein KI-Kalorientracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="app-dark">
        {children}
      </body>
    </html>
  );
}
