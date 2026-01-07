// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ThemeWrapper } from './theme-wrapper';

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
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
