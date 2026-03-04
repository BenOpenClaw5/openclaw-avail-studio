import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AVAIL Studio',
  description: 'Meta Ads Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
