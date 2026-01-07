import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/app/globals.css';
import { ThemeWrapper } from '@/app/theme-wrapper';

export const metadata: Metadata = {
  title: 'MacroVision AI Tracker',
  description: 'Intelligenter KI-gestützter Kalorientracker mit Gemini API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
