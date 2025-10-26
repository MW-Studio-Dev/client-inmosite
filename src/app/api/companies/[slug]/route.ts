import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const awaitedParams = await params
    const { slug } = awaitedParams

    // Aquí harías la llamada a tu API Django
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    if (!API_URL) {
      // Si no hay API configurada, devolver datos mock
      return NextResponse.json(getMockCompanyData(slug))
    }

    try {
      const response = await fetch(`${API_URL}/companies/public/${slug}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-API/1.0'
        },
        // Timeout de 5 segundos
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      } else {
        // Si no se encuentra en la API, devolver datos mock
        return NextResponse.json(getMockCompanyData(slug))
      }
    } catch (apiError) {
      console.error('Error calling Django API:', apiError)
      // En caso de error con la API, devolver datos mock
      return NextResponse.json(getMockCompanyData(slug))
    }

  } catch (error) {
    console.error('Error in company API route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getMockCompanyData(slug: string) {
  return {
    id: slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    description: 'Tu inmobiliaria de confianza',
    theme: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#059669'
    },
    settings: {
      showPricing: true,
      showTestimonials: true,
      showAbout: true
    },
    contact: {
      phone: '+1234567890',
      email: `contacto@${slug}.com`,
      whatsapp: '+1234567890',
      address: 'Dirección de la empresa'
    },
    social: {
      facebook: `https://facebook.com/${slug}`,
      instagram: `https://instagram.com/${slug}`,
      linkedin: `https://linkedin.com/company/${slug}`,
      twitter: `https://twitter.com/${slug}`
    },
    logo: null
  }
}