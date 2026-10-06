import type { Values } from '../types'

export const DOCUMENT_VALUES: Record<string, Values> = {
  configuracion: {
    aviso: 'Envío gratis desde $ 150.000 · Tostamos lunes y jueves en Bogotá',
    logo: { media: 'logo-verde-origen' },
    nav_1_texto: 'Cafés',
    nav_1_url: '/cafes',
    nav_2_texto: 'Orígenes',
    nav_2_url: '/origenes',
    nav_3_texto: 'Diario',
    nav_3_url: '/blog',
    nav_4_texto: 'Nosotros',
    nav_4_url: '/nosotros',
    nav_5_texto: 'Contacto',
    nav_5_url: '/contacto',
    lema: 'Café de cinco orígenes colombianos, comprado con precio publicado y tostado en Bogotá dos veces por semana.',
    direccion: 'Calle 59 # 13-27, Chapinero\nBogotá',
    horario:
      'Lunes a viernes | 8:00 a. m. a 6:00 p. m.\nSábados | 9:00 a. m. a 2:00 p. m.\nDomingos y festivos | Cerrado',
    email: 'hola@verdeorigen.co',
    whatsapp_url: 'https://wa.me/573104567890',
    instagram_url: 'https://www.instagram.com/verdeorigen.cafe',
    tiktok_url: 'https://www.tiktok.com/@verdeorigen.cafe',
    youtube_url: 'https://www.youtube.com/@verdeorigencafe',
    razon_social: 'Verde Origen S.A.S.',
    terminos_url: '/terminos-y-condiciones',
    datos_url: '/tratamiento-de-datos',
    envios_url: '/envios-y-devoluciones',
  },
  inicio: {
    hero_antetitulo: 'Cosecha principal 2026 · Huila, Nariño, Cauca y Tolima',
    hero_titulo: 'Cada bolsa trae el nombre de su finca',
    hero_texto:
      'Compramos lotes pequeños a catorce familias, los tostamos en Bogotá dos veces por semana y te los enviamos con la fecha de tueste impresa en la bolsa.',
    hero_cta_texto: 'Ver los cafés',
    hero_cta_url: '/cafes',
    hero_enlace_texto: 'Conocer los orígenes',
    hero_enlace_url: '/origenes',
    hero_imagen: { media: 'hero-manos-cereza' },
    dato_1_valor: '5',
    dato_1_texto: 'orígenes en Huila, Nariño, Cauca y Tolima',
    dato_2_valor: '14',
    dato_2_texto: 'familias productoras con nombre y apellido',
    dato_3_valor: '1.700–2.150',
    dato_3_texto: 'metros sobre el nivel del mar',
    dato_4_valor: '10 días',
    dato_4_texto: 'como máximo entre el tueste y tu taza',
    destacados_antetitulo: 'Cafés destacados',
    destacados_titulo: 'Lo que estamos tostando esta semana',
    destacados_texto:
      'Tres lotes de la cosecha principal, tostados el lunes 5 de octubre. Todos en 250 g, 500 g y 1 kg.',
    origenes_titulo: 'Cuatro regiones, una misma cordillera',
    origenes_texto:
      'Huila, Nariño, Cauca y Tolima comparten el macizo colombiano y una cosecha principal entre abril y julio. Volvemos a cada finca todos los años y catamos allá, con quien la cultiva, antes de comprar.',
    historia_antetitulo: 'Nuestra historia',
    historia_titulo: 'Empezamos con un solo saco de La Esperanza',
    historia_texto:
      'En 2021 Andrés le compró a Luz Marina Cuéllar un saco de 70 kg de pergamino y lo tostó por tandas en una máquina prestada. Se vendió en tres semanas, entre vecinos de Chapinero.\n\nHoy compramos a cinco orígenes, pagamos por encima del precio base de la Federación y publicamos cuánto. Seguimos tostando poco, para que el café te llegue fresco.',
    historia_imagen: { media: 'taller-tostadora' },
    historia_cta_texto: 'Conoce el taller',
    historia_cta_url: '/nosotros',
    diario_titulo: 'Notas desde la finca y la tostadora',
    boletin_titulo: 'Te avisamos cuando llegue un lote nuevo',
    boletin_texto:
      'Escribimos el día que tostamos el primer lote de cada cosecha, con las notas de catación y cuántos kilos hay. Nada más.',
    boletin_nota: 'Una carta al mes. Te das de baja con un clic.',
  },
  nosotros: {
    titulo: 'Tostamos poco y sabemos de dónde viene',
    intro:
      'Somos cuatro personas en un taller de Chapinero. Compramos a cinco orígenes, tostamos lunes y jueves y despachamos el resto de la semana.',
    portada: { media: 'taller-tostadora' },
    historia:
      '<h3>Desde 2021</h3>' +
      '<h2>Un saco, una máquina prestada</h2>' +
      '<p>Andrés Gaitán trabajó ocho años como barista antes de tostar su primer kilo. En 2021 viajó a Pitalito, conoció a Luz Marina Cuéllar y volvió a Bogotá con un saco de 70 kg de pergamino. Lo trilló en Neiva y lo tostó en la máquina de un amigo, de noche, en tandas de dos kilos.</p>' +
      '<p>Ese saco se vendió en tres semanas. El segundo también. En 2022 llegó Camila Restrepo a ordenar las compras y la catación, y con ella El Mirador y el grupo de Villa Rica. Daniela y Ana llegaron después, cuando los pedidos ya no cabían en un cuaderno.</p>' +
      '<p>Seguimos siendo pequeños a propósito. Cada lote que compramos lo podemos visitar, catar en la finca y explicar en la bolsa.</p>',
    principio_1_titulo: 'Precio publicado',
    principio_1_texto:
      'Pagamos cada carga por encima del precio base de la Federación del día, y en cada ficha de lote decimos cuánto pagamos y cuándo.',
    principio_2_titulo: 'Tueste de la semana',
    principio_2_texto:
      'Tostamos lunes y jueves en tandas de 12 kg. Ninguna bolsa sale del taller con más de diez días de tueste.',
    principio_3_titulo: 'Volver cada cosecha',
    principio_3_texto:
      'Visitamos cada finca al menos una vez al año y catamos allá, con quien la cultiva, antes de comprometer el lote.',
    galeria: [
      { media: 'taller-catacion', caption: 'La mesa de catación del lunes.' },
      { media: 'taller-enfriamiento', caption: 'Grano saliendo a la bandeja de enfriamiento.' },
      { media: 'equipo-sellando', caption: 'Ana sellando bolsas con la fecha de tueste.' },
      { media: 'origen-tolima', caption: 'Sacos de fique bajando de La Cumbre.' },
    ],
    visita_titulo: 'Visita el taller los sábados',
    visita_texto:
      'De 9:00 a. m. a 2:00 p. m. hay café filtrado gratis y puedes llevarte la bolsa recién tostada, sin envío.',
    visita_cta_url:
      'https://www.google.com/maps/search/?api=1&query=Calle+59+%2313-27+Chapinero+Bogot%C3%A1',
  },
  contacto: {
    titulo: 'Escríbenos',
    intro:
      'Respondemos en horario de taller, casi siempre el mismo día. Si es por un pedido, ten a mano el número que te llegó al correo.',
    asuntos:
      'Un pedido que ya hice\nQuiero elegir un café\nVentas por mayor\nVisitas al taller\nOtro tema',
    mapa_url:
      'https://www.google.com/maps/search/?api=1&query=Calle+59+%2313-27+Chapinero+Bogot%C3%A1',
    mayoristas_titulo: '¿Tienes una cafetería u oficina?',
    mayoristas_texto:
      'Vendemos por kilo desde 5 kg al mes, con precio fijo por cosecha y una visita de calibración del molino incluida.',
    mayoristas_email: 'mayoristas@verdeorigen.co',
  },
  'pagina-cafes': {
    titulo: 'Cafés',
    intro:
      'Seis lotes de la cosecha principal 2026. Cada uno viene de una sola finca o de un grupo de vecinos, y lleva en la bolsa la fecha de tueste.',
  },
  'pagina-origenes': {
    titulo: 'Orígenes',
    intro:
      'Compramos a cinco orígenes en cuatro departamentos. Volvemos cada cosecha, catamos en la finca y pagamos por encima del precio base de la Federación.',
  },
  'pagina-blog': {
    titulo: 'Diario',
    intro:
      'Lo que aprendemos en las fincas, en la tostadora y en la barra del taller. Escriben Camila, Andrés, Daniela y Ana.',
  },
  'pagina-preguntas': {
    titulo: 'Preguntas frecuentes',
    intro: 'Lo que más nos preguntan por WhatsApp y en el taller. Si no está aquí, escríbenos.',
  },
}
