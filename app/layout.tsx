import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hodges & Fooshee Realty - Premier MLS Search Platform',
  description: 'Advanced MLS property search platform with real-time listings, open houses, and agent directory.',
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
