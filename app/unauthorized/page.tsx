import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="glass-card max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-center text-white">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4">🚫</div>
          <p className="text-white/80 text-lg">
            You don't have permission to access this page.
          </p>
          <p className="text-white/70">
            This area is restricted to authorized users only.
          </p>
          <div className="pt-4 space-x-4">
            <Link href="/">
              <Button className="btn">Return to Homepage</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="btn-ghost">Sign In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
