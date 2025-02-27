import './globals.css'

export const metadata = {
  title: 'Retail Supply Chain Analysis',
  description: 'AI-powered retail supply chain analysis tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 