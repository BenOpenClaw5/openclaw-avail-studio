import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AVAIL Studio - Meta Ads Intelligence',
  description: 'Real-time Meta Ads analytics and strategic recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 to-slate-900">
        {children}
      </body>
    </html>
  );
}
