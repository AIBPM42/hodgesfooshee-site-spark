import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="glass-card max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-display text-center text-white">
            Account Pending Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white/80 text-lg">
            Thank you for registering as an agent with Hodges & Fooshee Realty!
          </p>
          <p className="text-white/70">
            Your account is currently pending approval from the broker.
            You'll receive an email once your account has been approved and activated.
          </p>
          <p className="text-white/60 text-sm">
            This usually takes 1-2 business days.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button className="btn">Return to Homepage</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
