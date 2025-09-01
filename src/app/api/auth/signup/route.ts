import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  companyName: z.string().min(1, 'Le nom de l\'organisation est requis'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, companyName } = signupSchema.parse(body)
    
    const supabase = await createClient()
    
    // Utiliser uniquement Supabase Auth - les triggers se chargeront du reste
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
        },
      },
    })

    if (authError) {
      console.error('Erreur signup:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'utilisateur' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Compte créé avec succès. Vérifiez votre email pour confirmer votre inscription.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    })

  } catch (error) {
    console.error('Erreur signup:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}