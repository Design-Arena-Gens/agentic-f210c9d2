import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Watchlist Organizer',
  description: 'Movie and TV Show Watchlist',
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
