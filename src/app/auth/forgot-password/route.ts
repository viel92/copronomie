import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)
    
    const supabase = await createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      console.error('Erreur reset password:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Un email de réinitialisation a été envoyé à votre adresse email.'
    })

  } catch (error) {
    console.error('Erreur forgot password:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}