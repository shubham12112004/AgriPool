import React from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Card, Button } from '../components/ui'

export default function VerifyEmail() {
  return (
    <Card className="p-8 text-center">
      <Mail className="mx-auto text-primary-500 mb-4" size={48} />
      <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
        We sent a verification link to your inbox. Enter the OTP below when available.
      </p>
      <div className="flex gap-2 justify-center mb-6">
        {['', '', '', '', '', ''].map((_, i) => (
          <input
            key={i}
            maxLength={1}
            className="w-10 h-12 text-center rounded-lg border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-card text-lg font-semibold"
          />
        ))}
      </div>
      <Button variant="primary" fullWidth className="mb-4">
        Verify
      </Button>
      <Link to="/login" className="text-sm text-primary-600 dark:text-primary-400">
        Back to sign in
      </Link>
    </Card>
  )
}
