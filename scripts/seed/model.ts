/**
 * The Zap content model for Verde Origen: five collections and eight
 * documents. Mirrors the design handoff's content model (see README,
 * "Content model"), with two constraints from Zap today:
 *
 * - No relation field type: relations are the target's slug in a TEXT field
 *   (`cafes.origen`, `blog.autor`, `blog.cafe_relacionado`), resolved and
 *   validated by the site.
 * - No repeatable groups: short fixed lists are numbered slots
 *   (`nav_1…5`, `dato_1…4`, `principio_1…3`).
 *
 * Field keys are snake_case and stable: the site's generated types
 * (`src/generated/cms`) are built from them.
 */

export type FieldType =
  | 'TEXT'
  | 'LONG_TEXT'
  | 'RICH_TEXT'
  | 'NUMBER'
  | 'INTEGER'
  | 'BOOLEAN'
  | 'DATE'
  | 'CURRENCY'
  | 'ENUM'
  | 'GALLERY'
  | 'IMAGE'
  | 'URL'
  | 'EMAIL'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  section: string
  required?: boolean
  unique?: boolean
  filterable?: boolean
  sortable?: boolean
  description?: string
  /** ENUM options as [value, label]. Values are what the site filters on. */
  options?: Array<[string, string]>
  gallery?: { min?: number; max?: number }
  currencies?: string[]
}

export interface ModelDef {
  key: string
  name: string
  description: string
  /**
   * «Ruta en tu sitio»: set in Zap's settings (not on the public API). Null
   * on a document used across the whole site (Configuración): Zap previews it
   * on the home page and it claims no page of its own.
   */
  previewPath: string | null
  sections: string[]
  fields: FieldDef[]
}

export const REGIONES: Array<[string, string]> = [
  ['huila', 'Huila'],
  ['narino', 'Nariño'],
  ['cauca', 'Cauca'],
  ['tolima', 'Tolima'],
]

const COP = ['COP']

function numbered(
  prefix: string,
  count: number,
  make: (n: number) => Omit<FieldDef, 'key'> & { suffix: string },
): FieldDef[] {
  return Array.from({ length: count }, (_, i) => {
    const { suffix, ...rest } = make(i + 1)
    return { key: `${prefix}_${i + 1}_${suffix}`, ...rest }
  })
}

// ── Collections ─────────────────────────────────────────────────────────────

const cafes: ModelDef = {
  key: 'cafes',
  name: 'Cafés',
  description: 'Cada lote que vendemos: ficha, notas, precio por tamaño y su finca.',
  previewPath: '/cafes/{slug}',
  sections: ['Presentación', 'Origen', 'Ficha de lote', 'Tienda'],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'TEXT', section: 'Presentación', required: true },
    {
      key: 'lote',
      label: 'Lote',
      type: 'TEXT',
      section: 'Presentación',
      required: true,
      unique: true,
      description: 'Solo el número, por ejemplo 07. El sitio escribe «Lote 07».',
    },
    {
      key: 'resumen',
      label: 'Resumen',
      type: 'LONG_TEXT',
      section: 'Presentación',
      required: true,
      description: 'Entrada de la ficha. Máximo 160 caracteres.',
    },
    { key: 'descripcion', label: 'Sobre este lote', type: 'RICH_TEXT', section: 'Presentación' },
    {
      key: 'preparacion',
      label: 'Cómo lo preparamos',
      type: 'LONG_TEXT',
      section: 'Presentación',
      description: 'Una receta por línea: «Método | receta».',
    },
    { key: 'foto', label: 'Foto', type: 'IMAGE', section: 'Presentación', required: true },
    {
      key: 'galeria',
      label: 'Galería',
      type: 'GALLERY',
      section: 'Presentación',
      gallery: { min: 4, max: 8 },
      description: 'De 4 a 8 fotos en 4:5.',
    },
    {
      key: 'origen',
      label: 'Finca (slug)',
      type: 'TEXT',
      section: 'Origen',
      required: true,
      filterable: true,
      description: 'El slug de la finca en Orígenes, por ejemplo la-esperanza.',
    },
    {
      key: 'region',
      label: 'Región',
      type: 'ENUM',
      section: 'Origen',
      required: true,
      filterable: true,
      options: [...REGIONES, ['varias', 'Varias regiones']],
    },
    { key: 'municipio', label: 'Municipio', type: 'TEXT', section: 'Origen', required: true },
    {
      key: 'productor',
      label: 'Productor o familia',
      type: 'TEXT',
      section: 'Origen',
      required: true,
    },
    {
      key: 'variedad',
      label: 'Variedad',
      type: 'ENUM',
      section: 'Ficha de lote',
      required: true,
      filterable: true,
      options: [
        ['caturra', 'Caturra'],
        ['castillo', 'Castillo'],
        ['colombia', 'Colombia'],
        ['geisha', 'Geisha'],
        ['pink_bourbon', 'Pink Bourbon'],
        ['tipica', 'Típica'],
        ['varias', 'Varias'],
      ],
    },
    {
      key: 'variedad_detalle',
      label: 'Variedades (detalle)',
      type: 'TEXT',
      section: 'Ficha de lote',
      description: 'Reemplaza la etiqueta cuando la variedad es «Varias».',
    },
    {
      key: 'proceso',
      label: 'Proceso',
      type: 'ENUM',
      section: 'Ficha de lote',
      required: true,
      filterable: true,
      options: [
        ['lavado', 'Lavado'],
        ['honey', 'Honey'],
        ['natural', 'Natural'],
        ['anaerobico', 'Anaeróbico'],
      ],
    },
    { key: 'proceso_detalle', label: 'Proceso (detalle)', type: 'TEXT', section: 'Ficha de lote' },
    {
      key: 'familia_notas',
      label: 'Familia de notas',
      type: 'ENUM',
      section: 'Ficha de lote',
      filterable: true,
      options: [
        ['frutal', 'Frutal'],
        ['floral', 'Floral'],
        ['citrico', 'Cítrico'],
        ['chocolate_caramelo', 'Chocolate y caramelo'],
      ],
    },
    {
      key: 'notas',
      label: 'Notas de catación',
      type: 'TEXT',
      section: 'Ficha de lote',
      required: true,
      description: 'Separadas por coma: Panela, Mandarina, Cacao.',
    },
    {
      key: 'altitud',
      label: 'Altitud (msnm)',
      type: 'INTEGER',
      section: 'Ficha de lote',
      required: true,
    },
    { key: 'secado', label: 'Secado', type: 'TEXT', section: 'Ficha de lote' },
    { key: 'cosecha', label: 'Cosecha', type: 'TEXT', section: 'Ficha de lote' },
    {
      key: 'puntaje',
      label: 'Puntaje SCA',
      type: 'NUMBER',
      section: 'Ficha de lote',
      description: 'De 80 a 100, con un decimal.',
    },
    {
      key: 'tueste',
      label: 'Tueste',
      type: 'ENUM',
      section: 'Ficha de lote',
      options: [
        ['claro', 'Claro'],
        ['medio_claro', 'Medio claro'],
        ['medio', 'Medio'],
        ['medio_oscuro', 'Medio oscuro'],
      ],
    },
    {
      key: 'precio_250',
      label: 'Precio 250 g',
      type: 'CURRENCY',
      section: 'Tienda',
      required: true,
      sortable: true,
      filterable: true,
      currencies: COP,
    },
    {
      key: 'precio_500',
      label: 'Precio 500 g',
      type: 'CURRENCY',
      section: 'Tienda',
      currencies: COP,
      description: 'Vacío: agotado en este tamaño.',
    },
    {
      key: 'precio_1kg',
      label: 'Precio 1 kg',
      type: 'CURRENCY',
      section: 'Tienda',
      currencies: COP,
      description: 'Vacío: agotado en este tamaño.',
    },
    {
      key: 'disponible',
      label: 'Disponible',
      type: 'BOOLEAN',
      section: 'Tienda',
      filterable: true,
    },
    {
      key: 'destacado',
      label: 'Destacado en Inicio',
      type: 'BOOLEAN',
      section: 'Tienda',
      filterable: true,
    },
    { key: 'orden', label: 'Orden', type: 'INTEGER', section: 'Tienda', sortable: true },
  ],
}

const origenes: ModelDef = {
  key: 'origenes',
  name: 'Orígenes',
  description: 'Las fincas y grupos a los que compramos.',
  previewPath: '/origenes/{slug}',
  sections: ['Finca', 'Historia', 'Fotos', 'Cómo llegar'],
  fields: [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'TEXT',
      section: 'Finca',
      required: true,
      description: 'Sin «Finca»: el sitio lo antepone en la ficha.',
    },
    {
      key: 'region',
      label: 'Región',
      type: 'ENUM',
      section: 'Finca',
      required: true,
      filterable: true,
      options: REGIONES,
    },
    { key: 'municipio', label: 'Municipio', type: 'TEXT', section: 'Finca', required: true },
    { key: 'vereda', label: 'Vereda', type: 'TEXT', section: 'Finca' },
    {
      key: 'productor',
      label: 'Productor o familia',
      type: 'TEXT',
      section: 'Finca',
      required: true,
    },
    {
      key: 'altitud_min',
      label: 'Altitud mínima (msnm)',
      type: 'INTEGER',
      section: 'Finca',
      required: true,
    },
    {
      key: 'altitud_max',
      label: 'Altitud máxima (msnm)',
      type: 'INTEGER',
      section: 'Finca',
      required: true,
    },
    { key: 'variedades', label: 'Variedades', type: 'TEXT', section: 'Finca' },
    { key: 'hectareas', label: 'Hectáreas', type: 'NUMBER', section: 'Finca' },
    { key: 'cosecha', label: 'Cosecha', type: 'TEXT', section: 'Finca' },
    { key: 'desde', label: 'Compramos desde (año)', type: 'INTEGER', section: 'Finca' },
    {
      key: 'resumen',
      label: 'Resumen',
      type: 'LONG_TEXT',
      section: 'Historia',
      description: 'Se muestra en la banda de origen de cada café.',
    },
    { key: 'historia', label: 'Historia', type: 'RICH_TEXT', section: 'Historia' },
    {
      key: 'cita',
      label: 'Cita del productor',
      type: 'LONG_TEXT',
      section: 'Historia',
      description: 'Se atribuye al productor.',
    },
    {
      key: 'foto_portada',
      label: 'Foto de portada',
      type: 'IMAGE',
      section: 'Fotos',
      required: true,
    },
    {
      key: 'foto_region',
      label: 'Foto de la región',
      type: 'IMAGE',
      section: 'Fotos',
      description:
        'Opcional, 3:4. La tarjeta de la región en Inicio usa la de la primera finca de la región; sin ella, la portada.',
    },
    { key: 'productor_foto', label: 'Foto del productor', type: 'IMAGE', section: 'Fotos' },
    {
      key: 'galeria',
      label: 'Galería',
      type: 'GALLERY',
      section: 'Fotos',
      gallery: { max: 3 },
      description: 'Tres fotos: 3:2, 3:4, 3:4.',
    },
    { key: 'mapa_imagen', label: 'Mapa', type: 'IMAGE', section: 'Cómo llegar' },
    { key: 'mapa_url', label: 'Enlace del mapa', type: 'URL', section: 'Cómo llegar' },
    {
      key: 'como_llegar',
      label: 'Cómo llegar',
      type: 'LONG_TEXT',
      section: 'Cómo llegar',
      description: 'La primera línea es el titular.',
    },
  ],
}

const blog: ModelDef = {
  key: 'blog',
  name: 'Diario',
  description: 'Artículos del diario: fincas, procesos, preparación y tostión.',
  previewPath: '/blog/{slug}',
  sections: ['Artículo', 'Publicación'],
  fields: [
    { key: 'titulo', label: 'Título', type: 'TEXT', section: 'Artículo', required: true },
    { key: 'extracto', label: 'Extracto', type: 'LONG_TEXT', section: 'Artículo', required: true },
    { key: 'portada', label: 'Portada', type: 'IMAGE', section: 'Artículo', required: true },
    { key: 'portada_pie', label: 'Pie de la portada', type: 'TEXT', section: 'Artículo' },
    { key: 'cuerpo', label: 'Cuerpo', type: 'RICH_TEXT', section: 'Artículo', required: true },
    {
      key: 'categoria',
      label: 'Categoría',
      type: 'ENUM',
      section: 'Publicación',
      required: true,
      filterable: true,
      options: [
        ['origen', 'Origen'],
        ['proceso', 'Proceso'],
        ['preparacion', 'Preparación'],
        ['tostion', 'Tostión'],
      ],
    },
    {
      key: 'autor',
      label: 'Autor (slug)',
      type: 'TEXT',
      section: 'Publicación',
      required: true,
      filterable: true,
      description: 'El slug de la persona, por ejemplo camila-restrepo.',
    },
    {
      key: 'fecha',
      label: 'Fecha',
      type: 'DATE',
      section: 'Publicación',
      required: true,
      sortable: true,
    },
    { key: 'lectura_min', label: 'Minutos de lectura', type: 'INTEGER', section: 'Publicación' },
    {
      key: 'destacado',
      label: 'Destacado',
      type: 'BOOLEAN',
      section: 'Publicación',
      filterable: true,
    },
    {
      key: 'cafe_relacionado',
      label: 'Café relacionado (slug)',
      type: 'TEXT',
      section: 'Publicación',
      description: 'El slug del café que cierra el artículo.',
    },
  ],
}

const personas: ModelDef = {
  key: 'personas',
  name: 'Personas',
  description: 'Quienes escriben el diario y el equipo del taller.',
  previewPath: '/nosotros',
  sections: ['Persona'],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'TEXT', section: 'Persona', required: true },
    { key: 'cargo', label: 'Cargo', type: 'TEXT', section: 'Persona', required: true },
    {
      key: 'foto',
      label: 'Foto',
      type: 'IMAGE',
      section: 'Persona',
      description:
        '4:5, con la cara en el tercio superior. Sin foto, el sitio muestra las iniciales.',
    },
    { key: 'bio', label: 'Biografía', type: 'LONG_TEXT', section: 'Persona' },
    {
      key: 'en_equipo',
      label: 'En el equipo',
      type: 'BOOLEAN',
      section: 'Persona',
      filterable: true,
    },
    { key: 'orden', label: 'Orden', type: 'INTEGER', section: 'Persona', sortable: true },
  ],
}

const preguntas: ModelDef = {
  key: 'preguntas',
  name: 'Preguntas frecuentes',
  description: 'Lo que más nos preguntan, por tema.',
  previewPath: '/preguntas-frecuentes',
  sections: ['Pregunta'],
  fields: [
    { key: 'pregunta', label: 'Pregunta', type: 'TEXT', section: 'Pregunta', required: true },
    {
      key: 'respuesta',
      label: 'Respuesta',
      type: 'RICH_TEXT',
      section: 'Pregunta',
      required: true,
    },
    {
      key: 'tema',
      label: 'Tema',
      type: 'ENUM',
      section: 'Pregunta',
      required: true,
      filterable: true,
      options: [
        ['pedidos_envios', 'Pedidos y envíos'],
        ['cafe_preparacion', 'Café y preparación'],
        ['mayoristas_visitas', 'Mayoristas y visitas'],
      ],
    },
    { key: 'orden', label: 'Orden', type: 'INTEGER', section: 'Pregunta', sortable: true },
  ],
}

export const COLLECTIONS: ModelDef[] = [origenes, personas, cafes, blog, preguntas]

// ── Documents ───────────────────────────────────────────────────────────────

const configuracion: ModelDef = {
  key: 'configuracion',
  name: 'Configuración',
  description: 'Encabezado, pie de página y datos de contacto de todo el sitio.',
  // Site-wide: no page of its own (Inicio is `/`).
  previewPath: null,
  sections: ['Encabezado', 'Pie de página', 'Contacto', 'Legal'],
  fields: [
    {
      key: 'aviso',
      label: 'Aviso',
      type: 'TEXT',
      section: 'Encabezado',
      description: 'Franja sobre el encabezado. Máximo 90 caracteres.',
    },
    {
      key: 'logo',
      label: 'Logo',
      type: 'IMAGE',
      section: 'Encabezado',
      required: true,
      description: 'Su texto alternativo es el nombre de la marca.',
    },
    ...numbered('nav', 5, (n) => ({
      suffix: 'texto',
      label: `Menú ${n}: texto`,
      type: 'TEXT',
      section: 'Encabezado',
      required: true,
    })),
    ...numbered('nav', 5, (n) => ({
      suffix: 'url',
      label: `Menú ${n}: enlace`,
      type: 'URL',
      section: 'Encabezado',
      required: true,
    })),
    { key: 'lema', label: 'Lema', type: 'LONG_TEXT', section: 'Pie de página' },
    {
      key: 'direccion',
      label: 'Dirección',
      type: 'LONG_TEXT',
      section: 'Contacto',
      required: true,
      description: 'Una línea por renglón.',
    },
    {
      key: 'horario',
      label: 'Horario',
      type: 'LONG_TEXT',
      section: 'Contacto',
      required: true,
      description: 'Una línea por día: «Día | hora».',
    },
    { key: 'email', label: 'Correo', type: 'EMAIL', section: 'Contacto', required: true },
    { key: 'whatsapp_url', label: 'WhatsApp', type: 'URL', section: 'Contacto' },
    { key: 'instagram_url', label: 'Instagram', type: 'URL', section: 'Pie de página' },
    { key: 'tiktok_url', label: 'TikTok', type: 'URL', section: 'Pie de página' },
    { key: 'youtube_url', label: 'YouTube', type: 'URL', section: 'Pie de página' },
    { key: 'razon_social', label: 'Razón social', type: 'TEXT', section: 'Legal', required: true },
    {
      key: 'terminos_url',
      label: 'Términos y condiciones',
      type: 'URL',
      section: 'Legal',
      required: true,
    },
    {
      key: 'datos_url',
      label: 'Tratamiento de datos personales',
      type: 'URL',
      section: 'Legal',
      required: true,
    },
    {
      key: 'envios_url',
      label: 'Envíos y devoluciones',
      type: 'URL',
      section: 'Legal',
      required: true,
    },
  ],
}

const inicio: ModelDef = {
  key: 'inicio',
  name: 'Inicio',
  description: 'La página de inicio.',
  previewPath: '/',
  sections: ['Héroe', 'Cifras', 'Cafés destacados', 'Orígenes', 'Historia', 'Diario', 'Boletín'],
  fields: [
    { key: 'hero_antetitulo', label: 'Antetítulo', type: 'TEXT', section: 'Héroe' },
    {
      key: 'hero_titulo',
      label: 'Título',
      type: 'TEXT',
      section: 'Héroe',
      required: true,
      description: 'Máximo 45 caracteres.',
    },
    { key: 'hero_texto', label: 'Texto', type: 'LONG_TEXT', section: 'Héroe', required: true },
    {
      key: 'hero_cta_texto',
      label: 'Botón: texto',
      type: 'TEXT',
      section: 'Héroe',
      required: true,
    },
    { key: 'hero_cta_url', label: 'Botón: enlace', type: 'URL', section: 'Héroe', required: true },
    { key: 'hero_enlace_texto', label: 'Enlace: texto', type: 'TEXT', section: 'Héroe' },
    { key: 'hero_enlace_url', label: 'Enlace: destino', type: 'URL', section: 'Héroe' },
    { key: 'hero_imagen', label: 'Imagen', type: 'IMAGE', section: 'Héroe', required: true },
    ...numbered('dato', 4, (n) => ({
      suffix: 'valor',
      label: `Cifra ${n}`,
      type: 'TEXT',
      section: 'Cifras',
    })),
    ...numbered('dato', 4, (n) => ({
      suffix: 'texto',
      label: `Cifra ${n}: texto`,
      type: 'TEXT',
      section: 'Cifras',
    })),
    {
      key: 'destacados_antetitulo',
      label: 'Cafés destacados: antetítulo',
      type: 'TEXT',
      section: 'Cafés destacados',
    },
    {
      key: 'destacados_titulo',
      label: 'Cafés destacados: título',
      type: 'TEXT',
      section: 'Cafés destacados',
    },
    {
      key: 'destacados_texto',
      label: 'Cafés destacados: nota',
      type: 'LONG_TEXT',
      section: 'Cafés destacados',
    },
    { key: 'origenes_titulo', label: 'Orígenes: título', type: 'TEXT', section: 'Orígenes' },
    { key: 'origenes_texto', label: 'Orígenes: texto', type: 'LONG_TEXT', section: 'Orígenes' },
    {
      key: 'historia_antetitulo',
      label: 'Historia: antetítulo',
      type: 'TEXT',
      section: 'Historia',
    },
    { key: 'historia_titulo', label: 'Historia: título', type: 'TEXT', section: 'Historia' },
    {
      key: 'historia_texto',
      label: 'Historia: texto',
      type: 'LONG_TEXT',
      section: 'Historia',
      description: 'Dos párrafos, separados por una línea en blanco.',
    },
    { key: 'historia_imagen', label: 'Historia: imagen', type: 'IMAGE', section: 'Historia' },
    {
      key: 'historia_cta_texto',
      label: 'Historia: texto del enlace',
      type: 'TEXT',
      section: 'Historia',
    },
    {
      key: 'historia_cta_url',
      label: 'Historia: destino del enlace',
      type: 'URL',
      section: 'Historia',
    },
    { key: 'diario_titulo', label: 'Diario: título', type: 'TEXT', section: 'Diario' },
    { key: 'boletin_titulo', label: 'Boletín: título', type: 'TEXT', section: 'Boletín' },
    { key: 'boletin_texto', label: 'Boletín: texto', type: 'LONG_TEXT', section: 'Boletín' },
    { key: 'boletin_nota', label: 'Boletín: nota', type: 'TEXT', section: 'Boletín' },
  ],
}

function listPage(key: string, name: string, previewPath: string, withMap = false): ModelDef {
  return {
    key,
    name,
    description: `Encabezado de la página ${name}.`,
    previewPath,
    sections: ['Encabezado'],
    fields: [
      { key: 'titulo', label: 'Título', type: 'TEXT', section: 'Encabezado', required: true },
      { key: 'intro', label: 'Introducción', type: 'LONG_TEXT', section: 'Encabezado' },
      ...(withMap
        ? [
            {
              key: 'mapa',
              label: 'Mapa de regiones',
              type: 'IMAGE' as const,
              section: 'Encabezado',
              description: '4:3.',
            },
          ]
        : []),
    ],
  }
}

const nosotros: ModelDef = {
  key: 'nosotros',
  name: 'Nosotros',
  description: 'La página Nosotros.',
  previewPath: '/nosotros',
  sections: ['Encabezado', 'Historia', 'Principios', 'Galería', 'Visita'],
  fields: [
    { key: 'titulo', label: 'Título', type: 'TEXT', section: 'Encabezado', required: true },
    { key: 'intro', label: 'Introducción', type: 'LONG_TEXT', section: 'Encabezado' },
    { key: 'portada', label: 'Portada', type: 'IMAGE', section: 'Encabezado', required: true },
    {
      key: 'historia',
      label: 'Historia',
      type: 'RICH_TEXT',
      section: 'Historia',
      description: 'El primer titular es el título de la sección.',
    },
    ...[1, 2, 3].flatMap((n): FieldDef[] => [
      {
        key: `principio_${n}_titulo`,
        label: `Principio ${n}: título`,
        type: 'TEXT',
        section: 'Principios',
      },
      {
        key: `principio_${n}_texto`,
        label: `Principio ${n}: texto`,
        type: 'LONG_TEXT',
        section: 'Principios',
      },
    ]),
    {
      key: 'galeria',
      label: 'Galería',
      type: 'GALLERY',
      section: 'Galería',
      gallery: { max: 4 },
      description: 'Cuatro fotos: 4:5, 3:4, 3:4, 4:5.',
    },
    { key: 'visita_titulo', label: 'Visita: título', type: 'TEXT', section: 'Visita' },
    { key: 'visita_texto', label: 'Visita: texto', type: 'LONG_TEXT', section: 'Visita' },
    {
      key: 'visita_cta_url',
      label: 'Visita: enlace «Cómo llegar»',
      type: 'URL',
      section: 'Visita',
    },
  ],
}

const contacto: ModelDef = {
  key: 'contacto',
  name: 'Contacto',
  description: 'La página Contacto. El formulario lo procesa el sitio.',
  previewPath: '/contacto',
  sections: ['Encabezado', 'Formulario', 'Mapa', 'Mayoristas'],
  fields: [
    { key: 'titulo', label: 'Título', type: 'TEXT', section: 'Encabezado', required: true },
    {
      key: 'intro',
      label: 'Introducción',
      type: 'LONG_TEXT',
      section: 'Encabezado',
      required: true,
    },
    {
      key: 'asuntos',
      label: 'Asuntos',
      type: 'LONG_TEXT',
      section: 'Formulario',
      required: true,
      description: 'Las opciones del campo «Asunto», una por línea.',
    },
    { key: 'mapa_imagen', label: 'Mapa', type: 'IMAGE', section: 'Mapa', description: '4:3.' },
    { key: 'mapa_url', label: 'Mapa: enlace', type: 'URL', section: 'Mapa' },
    { key: 'mayoristas_titulo', label: 'Mayoristas: título', type: 'TEXT', section: 'Mayoristas' },
    {
      key: 'mayoristas_texto',
      label: 'Mayoristas: texto',
      type: 'LONG_TEXT',
      section: 'Mayoristas',
    },
    { key: 'mayoristas_email', label: 'Mayoristas: correo', type: 'EMAIL', section: 'Mayoristas' },
  ],
}

export const DOCUMENTS: ModelDef[] = [
  configuracion,
  inicio,
  nosotros,
  contacto,
  listPage('pagina-cafes', 'Cafés', '/cafes'),
  listPage('pagina-origenes', 'Orígenes', '/origenes', true),
  listPage('pagina-blog', 'Diario', '/blog'),
  listPage('pagina-preguntas', 'Preguntas frecuentes', '/preguntas-frecuentes'),
]
