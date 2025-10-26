import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const awaitedParams = await params
    const { slug } = awaitedParams
    const { searchParams } = new URL(request.url)

    const limit = searchParams.get('limit') || '6'
    const status = searchParams.get('status') || 'disponible'
    const page = searchParams.get('page') || '1'

    // Aquí harías la llamada a tu API Django
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    if (!API_URL) {
      // Si no hay API configurada, devolver datos mock
      return NextResponse.json(getMockProperties(slug, parseInt(limit)))
    }

    try {
      const queryParams = new URLSearchParams({
        limit,
        status,
        page
      })

      const response = await fetch(
        `${API_URL}/companies/public/${slug}/properties/?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-API/1.0'
          },
          // Timeout de 5 segundos
          signal: AbortSignal.timeout(5000)
        }
      )

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      } else {
        // Si no se encuentra en la API, devolver datos mock
        return NextResponse.json(getMockProperties(slug, parseInt(limit)))
      }
    } catch (apiError) {
      console.error('Error calling Django API:', apiError)
      // En caso de error con la API, devolver datos mock
      return NextResponse.json(getMockProperties(slug, parseInt(limit)))
    }

  } catch (error) {
    console.error('Error in properties API route:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getMockProperties(companySlug: string, limit: number = 6) {
  const properties = [
    {
      id: '1',
      title: 'Casa moderna en zona residencial',
      price_display: '$250.000',
      location_display: 'Zona Norte, Ciudad',
      property_type: 'casa',
      operation_type: 'venta',
      main_features: '3 hab. • 2 baños • 150 m²',
      is_featured: true,
      status: 'disponible',
      created_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      id: '2',
      title: 'Apartamento céntrico con vista',
      price_display: '$180.000',
      location_display: 'Centro, Ciudad',
      property_type: 'apartamento',
      operation_type: 'venta',
      main_features: '2 hab. • 1 baño • 80 m²',
      is_featured: false,
      status: 'disponible',
      created_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      id: '3',
      title: 'Local comercial en avenida principal',
      price_display: '$120.000',
      location_display: 'Avenida Principal, Ciudad',
      property_type: 'local',
      operation_type: 'venta',
      main_features: '100 m² • Esquina • Vidriera',
      is_featured: false,
      status: 'disponible',
      created_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      id: '4',
      title: 'Departamento en alquiler',
      price_display: '$800/mes',
      location_display: 'Barrio Residencial, Ciudad',
      property_type: 'apartamento',
      operation_type: 'alquiler',
      main_features: '2 hab. • 1 baño • 70 m²',
      is_featured: false,
      status: 'disponible',
      created_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      id: '5',
      title: 'Casa familiar con jardín',
      price_display: '$320.000',
      location_display: 'Suburbios, Ciudad',
      property_type: 'casa',
      operation_type: 'venta',
      main_features: '4 hab. • 3 baños • 200 m² • Jardín',
      is_featured: true,
      status: 'disponible',
      created_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      id: '6',
      title: 'Oficina comercial',
      price_display: '$1.200/mes',
      location_display: 'Distrito Comercial, Ciudad',
      property_type: 'oficina',
      operation_type: 'alquiler',
      main_features: '3 oficinas • 1 baño • 90 m²',
      is_featured: false,
      status: 'disponible',
      created_at: new Date().toISOString(),
      featured_image_url: null
    }
  ]

  // Personalizar los datos para cada empresa
  const customizedProperties = properties.map(property => ({
    ...property,
    title: `${property.title} - ${companySlug.toUpperCase()}`
  }))

  return {
    results: customizedProperties.slice(0, limit),
    count: customizedProperties.length,
    next: null,
    previous: null
  }
}