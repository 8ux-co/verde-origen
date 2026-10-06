import type { Entry } from '../types'

/**
 * Coffees and farms. Prices are COP with IVA included; the seed stores them
 * as CURRENCY in minor units. `null` for a size means sold out.
 */

export const ORIGENES: Entry[] = [
  {
    slug: 'la-esperanza',
    values: {
      nombre: 'La Esperanza',
      region: 'huila',
      municipio: 'Pitalito',
      vereda: 'Vereda Bruselas',
      productor: 'Luz Marina Cuéllar',
      altitud_min: 1780,
      altitud_max: 1900,
      variedades: 'Caturra, Castillo y Pink Bourbon',
      hectareas: 4.5,
      cosecha: 'Abril a junio',
      desde: 2021,
      resumen:
        'Cuatro hectáreas y media en la vereda Bruselas, a 25 minutos de Pitalito. Luz Marina las trabaja con sus dos hijos y, en cosecha, con ocho recolectores que vuelven cada año.',
      historia:
        '<h2>Tres generaciones en el mismo filo</h2>' +
        '<p>El papá de Luz Marina sembró los primeros surcos de Caturra en 1978, cuando la vereda Bruselas todavía se recorría a lomo de mula. Ella heredó la finca en 2009 y la renovó lote por lote, sin arrancar el sombrío de guamo que mantiene fresca la ladera.</p>' +
        '<p>Desde 2021 separa para nosotros la cereza de los lotes altos, por encima de 1.850 metros. La recoge en tres pases, la despulpa el mismo día y la seca en una marquesina que construyó con el pago de la primera cosecha que nos vendió.</p>' +
        '<p>En 2025 empezó a sembrar Pink Bourbon en el lote de arriba. Las primeras cerezas salen en la cosecha de 2027; ya nos pidió que las catemos juntos.</p>',
      cita: 'La cereza se coge madura o no se coge. Eso es lo que más cuesta enseñarle a un recolector nuevo.',
      foto_portada: { media: 'hero-filo-neblina' },
      foto_region: { media: 'origen-huila' },
      productor_foto: { media: 'retrato-caficultora' },
      galeria: [
        { media: 'proceso-macro-cereza', caption: 'Cereza madura y pintona en la misma rama.' },
        {
          media: 'proceso-camas-secado',
          caption: 'La marquesina por dentro, con el pergamino extendido.',
        },
        { media: 'hero-manos-cereza', caption: 'Selección a mano antes del despulpado.' },
      ],
      mapa_url: 'https://www.google.com/maps/search/?api=1&query=Vereda+Bruselas+Pitalito+Huila',
      como_llegar:
        'A 25 minutos de Pitalito\nPor la vía a Bruselas hasta la escuela de la vereda, y luego 2 km de carretera destapada. Recibimos visitas en cosecha, con cita.',
    },
  },
  {
    slug: 'el-mirador',
    values: {
      nombre: 'El Mirador',
      region: 'huila',
      municipio: 'Acevedo',
      vereda: 'Vereda San Isidro',
      productor: 'Hernán Claros',
      altitud_min: 1850,
      altitud_max: 1980,
      variedades: 'Pink Bourbon y Caturra',
      hectareas: 3,
      cosecha: 'Mayo a julio',
      desde: 2022,
      resumen:
        'Tres hectáreas en la vereda San Isidro, sobre el cañón del Suaza. Hernán mide los grados Brix de cada tanda y fermenta en tanques cerrados, a la sombra.',
      historia:
        '<h2>El que mide todo</h2>' +
        '<p>Hernán Claros fue técnico del comité de cafeteros durante doce años antes de volver a la finca de su familia en Acevedo. De esa época le quedó la costumbre de anotar: cuántos kilos recoge cada recolector, a qué temperatura amanece el tanque, cuántos días tarda en secar cada lote.</p>' +
        '<p>Llegamos a El Mirador en 2022 por una muestra de Pink Bourbon que nos mandó por correo. La catamos tres veces antes de creer que era un honey de Huila y no un natural de otra parte.</p>' +
        '<p>Este año probamos con él tres tiempos de fermentación, 12, 24 y 36 horas, con la misma cereza. Lo contamos en el diario.</p>',
      cita: 'Si no lo anoto, no lo puedo repetir. Y si no lo puedo repetir, no es un proceso, es suerte.',
      foto_portada: { media: 'proceso-camas-secado' },
      productor_foto: { media: 'retrato-caficultor' },
      galeria: [
        { media: 'proceso-fermentacion', caption: 'Tanques cerrados, a la sombra.' },
        { media: 'proceso-camas-secado', caption: 'Camas africanas al final de la tarde.' },
        { media: 'proceso-macro-cereza', caption: 'Pink Bourbon en la rama.' },
      ],
      mapa_url: 'https://www.google.com/maps/search/?api=1&query=Acevedo+Huila',
      como_llegar:
        'A 40 minutos de Acevedo\nPor la vía a San Isidro hasta el puente sobre el Suaza, y luego 6 km de carretera destapada en subida. Recibimos visitas en cosecha, con cita.',
    },
  },
  {
    slug: 'los-andes',
    values: {
      nombre: 'Los Andes',
      region: 'narino',
      municipio: 'Buesaco',
      vereda: 'Vereda Santa María',
      productor: 'Familia Delgado Jojoa',
      altitud_min: 2000,
      altitud_max: 2150,
      variedades: 'Geisha, Caturra y Castillo',
      hectareas: 2.5,
      cosecha: 'Mayo a julio',
      desde: 2023,
      resumen:
        'Dos hectáreas y media colgadas del cañón del Juanambú, a más de 2.000 metros. Los Delgado secan lento, hasta 30 días, por el frío de la tarde.',
      historia:
        '<h2>Café a la altura del frío</h2>' +
        '<p>En Buesaco el café madura despacio: a 2.100 metros la cereza puede tardar diez meses desde la flor. Don Arturo Delgado y su esposa, Rosalba Jojoa, trabajan la finca con tres de sus hijos y separan el Geisha en un lote propio, al pie del filo.</p>' +
        '<p>Daniela pasó una semana con ellos durante la cosecha de 2023. Volvió con una muestra de Geisha natural y la decisión de comprar todo el lote del año siguiente.</p>',
      cita: 'Aquí el café no se apura. El que se apura, lo pierde en el secado.',
      foto_portada: { media: 'origen-narino' },
      foto_region: { media: 'origen-narino' },
      productor_foto: { media: 'retrato-caficultor' },
      galeria: [
        { media: 'origen-narino', caption: 'El cañón del Juanambú desde el beneficiadero.' },
        { media: 'proceso-camas-secado', caption: 'Secado lento bajo techo.' },
        { media: 'proceso-macro-cereza', caption: 'Geisha en la rama.' },
      ],
      mapa_url: 'https://www.google.com/maps/search/?api=1&query=Buesaco+Nari%C3%B1o',
      como_llegar:
        'A una hora de Pasto\nPor la vía a Buesaco y luego hacia la vereda Santa María, 9 km de carretera destapada. Recibimos visitas en cosecha, con cita.',
    },
  },
  {
    slug: 'villa-rica',
    values: {
      nombre: 'Villa Rica',
      region: 'cauca',
      municipio: 'Inzá',
      vereda: 'Resguardo de San Andrés de Pisimbalá',
      productor: 'Rosa Elvira Yace y 9 familias',
      altitud_min: 1700,
      altitud_max: 1800,
      variedades: 'Castillo y Caturra',
      hectareas: 18,
      cosecha: 'Abril a junio',
      desde: 2022,
      resumen:
        'Diez familias vecinas de Tierradentro que despulpan cada una en su casa y secan juntas en una marquesina comunal. Rosa Elvira Yace coordina el grupo.',
      historia:
        '<h2>Diez familias, una marquesina</h2>' +
        '<p>Hasta 2021, cada familia del grupo secaba su café en el patio, sobre lonas, y lo vendía mojado al intermediario del pueblo. Ese año juntaron lo de dos cosechas para construir una marquesina comunal de 200 metros cuadrados.</p>' +
        '<p>Con el café seco bajo techo pudieron venderlo por calidad. Nosotros compramos su lavado desde 2022, mezclando el café de las diez familias en un solo lote, y cada año visitamos la marquesina el día del pesaje.</p>',
      cita: 'Antes vendíamos el café por kilos. Ahora lo vendemos por lo que sabe.',
      foto_portada: { media: 'comunidad-villa-rica' },
      foto_region: { media: 'origen-cauca' },
      productor_foto: { media: 'retrato-caficultora' },
      galeria: [
        { media: 'origen-cauca', caption: 'La marquesina comunal con Tierradentro al fondo.' },
        { media: 'comunidad-villa-rica', caption: 'Las familias del grupo el día del pesaje.' },
        { media: 'proceso-macro-cereza', caption: 'Cereza de Castillo.' },
      ],
      mapa_url:
        'https://www.google.com/maps/search/?api=1&query=San+Andr%C3%A9s+de+Pisimbal%C3%A1+Inz%C3%A1',
      como_llegar:
        'A 20 minutos de San Andrés de Pisimbalá\nDesde Inzá por la vía a Tierradentro. La marquesina queda junto a la escuela del resguardo. Recibimos visitas en cosecha, con cita.',
    },
  },
  {
    slug: 'la-cumbre',
    values: {
      nombre: 'La Cumbre',
      region: 'tolima',
      municipio: 'Planadas',
      vereda: 'Corregimiento de Gaitania',
      productor: 'José Libardo Ramírez',
      altitud_min: 1750,
      altitud_max: 1900,
      variedades: 'Caturra y Colombia',
      hectareas: 5,
      cosecha: 'Abril a junio, traviesa en noviembre',
      desde: 2024,
      resumen:
        'Cinco hectáreas en Gaitania, al sur del Tolima, a las que todavía se llega a caballo el último tramo. Don José Libardo hace un honey de mucílago medio.',
      historia:
        '<h2>El último tramo, en mula</h2>' +
        '<p>La Cumbre queda a dos horas de Planadas, y los últimos cuatro kilómetros son camino de herradura. El café baja en mula hasta la carretera, en sacos de fique, como hace cuarenta años.</p>' +
        '<p>Don José Libardo Ramírez empezó a hacer honey en 2023, después de una capacitación en Gaitania. Deja la mitad del mucílago y seca en camas elevadas, moviendo el grano cada dos horas.</p>',
      cita: 'El honey hay que moverlo como si fuera arroz en la olla: si se pega, se daña.',
      foto_portada: { media: 'origen-tolima' },
      foto_region: { media: 'origen-tolima' },
      productor_foto: { media: 'retrato-caficultor' },
      galeria: [
        { media: 'origen-tolima', caption: 'El camino de herradura hacia La Cumbre.' },
        { media: 'proceso-camas-secado', caption: 'Honey en camas elevadas.' },
        { media: 'proceso-macro-cereza', caption: 'Caturra en la rama.' },
      ],
      mapa_url: 'https://www.google.com/maps/search/?api=1&query=Gaitania+Planadas+Tolima',
      como_llegar:
        'A dos horas de Planadas\nPor carretera hasta Gaitania y luego cuatro kilómetros de camino de herradura. Recibimos visitas en cosecha, con cita y con caballo.',
    },
  },
]

export const CAFES: Entry[] = [
  {
    slug: 'la-esperanza-lote-07',
    values: {
      nombre: 'La Esperanza',
      lote: '07',
      resumen:
        'Caturra lavado de Pitalito, dulce y limpio, con una acidez de mandarina que se queda.',
      descripcion:
        '<p>Luz Marina recoge este Caturra en tres pases entre abril y junio, solo la cereza que ya cambió de rojo a vino. Despulpa el mismo día, fermenta 18 horas en tanque de baldosa y lava con agua de la quebrada que baja del filo.</p>' +
        '<p>Lo tostamos medio claro, lo justo para que la panela y el cacao aparezcan sin tapar la acidez. Es el café con el que empezamos, y el que más gente repite.</p>',
      preparacion:
        'V60 | 15 g de café, 250 ml de agua a 93 °C, 2:45 de tiempo total.\nPrensa francesa | 30 g, 500 ml a 94 °C, 4 minutos y bajar despacio.\nGreca | Molienda media fina, fuego bajo y retirar apenas empiece a gorgotear.',
      foto: { media: 'producto-bolsa-250' },
      galeria: [
        { media: 'producto-bolsa-250' },
        { media: 'hero-manos-cereza' },
        { media: 'proceso-macro-cereza' },
        { media: 'taller-enfriamiento' },
        { media: 'taller-catacion' },
      ],
      origen: 'la-esperanza',
      region: 'huila',
      municipio: 'Pitalito',
      productor: 'Luz Marina Cuéllar',
      variedad: 'caturra',
      proceso: 'lavado',
      proceso_detalle: '18 horas de fermentación',
      familia_notas: 'citrico',
      notas: 'Panela, Mandarina, Cacao',
      altitud: 1850,
      secado: 'Marquesina, 18 días',
      cosecha: 'Mayo de 2026',
      puntaje: 86,
      tueste: 'medio_claro',
      precio_250: 48000,
      precio_500: 89000,
      precio_1kg: 168000,
      disponible: true,
      destacado: true,
      orden: 1,
    },
  },
  {
    slug: 'el-mirador-pink-bourbon',
    values: {
      nombre: 'El Mirador',
      lote: '12',
      resumen:
        'Pink Bourbon honey de Acevedo con 36 horas de fermentación: guayaba, jazmín y un cuerpo sedoso.',
      descripcion:
        '<p>Hernán Claros fermenta esta cereza 36 horas en tanques sellados, a la sombra, antes de despulpar. Deja el mucílago y la seca en camas africanas durante tres semanas, moviéndola cuatro veces al día.</p>' +
        '<p>Lo tostamos claro para que la fruta mande. Es el lote que más nos costó elegir: probamos tres tiempos de fermentación con la misma cereza y nos quedamos con el más largo.</p>',
      preparacion:
        'V60 | 15 g de café, 250 ml de agua a 92 °C, 2:30 de tiempo total.\nAeroPress | 16 g, 230 ml a 90 °C, 1:45 y prensar despacio.\nEspresso | 18 g para 40 g de bebida en 28 segundos.',
      foto: { media: 'proceso-macro-cereza' },
      galeria: [
        { media: 'proceso-macro-cereza' },
        { media: 'proceso-fermentacion' },
        { media: 'proceso-camas-secado' },
        { media: 'retrato-caficultor' },
      ],
      origen: 'el-mirador',
      region: 'huila',
      municipio: 'Acevedo',
      productor: 'Hernán Claros',
      variedad: 'pink_bourbon',
      proceso: 'honey',
      proceso_detalle: '36 horas de fermentación anaeróbica en cereza',
      familia_notas: 'floral',
      notas: 'Guayaba, Jazmín, Panela',
      altitud: 1920,
      secado: 'Camas africanas, 21 días',
      cosecha: 'Junio de 2026',
      puntaje: 87.5,
      tueste: 'claro',
      precio_250: 62000,
      precio_500: 116000,
      precio_1kg: null,
      disponible: true,
      destacado: true,
      orden: 2,
    },
  },
  {
    slug: 'los-andes-geisha',
    values: {
      nombre: 'Los Andes',
      lote: '03',
      resumen:
        'Geisha natural de Buesaco, a 2.100 metros: bergamota, durazno y té negro. Edición limitada.',
      descripcion:
        '<p>Los Delgado secan la cereza entera, sin despulpar, durante 30 días en camas bajo techo. A esta altura las tardes son frías y el secado va lento, que es justo lo que un natural necesita para quedar limpio.</p>' +
        '<p>Compramos 120 kg, todo el lote de Geisha de este año. Lo tostamos claro y en tandas pequeñas, los jueves.</p>',
      preparacion:
        'V60 | 15 g de café, 250 ml de agua a 91 °C, 2:40 de tiempo total.\nChemex | 30 g, 500 ml a 92 °C, 4:30 de tiempo total.',
      foto: { media: 'origen-narino' },
      galeria: [
        { media: 'origen-narino' },
        { media: 'taller-catacion' },
        { media: 'proceso-macro-cereza' },
        { media: 'retrato-caficultor' },
      ],
      origen: 'los-andes',
      region: 'narino',
      municipio: 'Buesaco',
      productor: 'Familia Delgado Jojoa',
      variedad: 'geisha',
      proceso: 'natural',
      proceso_detalle: 'Secado en cereza, 30 días',
      familia_notas: 'floral',
      notas: 'Bergamota, Durazno, Té negro',
      altitud: 2100,
      secado: 'Camas bajo techo, 30 días',
      cosecha: 'Julio de 2026',
      puntaje: 89,
      tueste: 'claro',
      precio_250: 96000,
      precio_500: null,
      precio_1kg: null,
      disponible: true,
      destacado: true,
      orden: 3,
    },
  },
  {
    slug: 'villa-rica-castillo',
    values: {
      nombre: 'Villa Rica',
      lote: '09',
      resumen: 'Castillo lavado de diez familias de Inzá: caramelo, naranja y chocolate con leche.',
      descripcion:
        '<p>Cada familia del Grupo Villa Rica despulpa en su casa y lleva el café húmedo a la marquesina comunal, donde se seca junto durante 15 días. El lote mezcla el café de las diez familias.</p>' +
        '<p>Lo tostamos medio, para un café de todos los días que aguanta leche y greca sin perder el dulce.</p>',
      preparacion:
        'Greca | Molienda media fina, fuego bajo y retirar apenas empiece a gorgotear.\nPrensa francesa | 30 g, 500 ml a 94 °C, 4 minutos.\nEspresso | 18 g para 36 g de bebida en 27 segundos.',
      foto: { media: 'producto-bolsa-500-abierta' },
      galeria: [
        { media: 'producto-bolsa-500-abierta' },
        { media: 'comunidad-villa-rica' },
        { media: 'origen-cauca' },
        { media: 'taller-enfriamiento' },
      ],
      origen: 'villa-rica',
      region: 'cauca',
      municipio: 'Inzá',
      productor: 'Grupo Villa Rica',
      variedad: 'castillo',
      proceso: 'lavado',
      proceso_detalle: '20 horas de fermentación',
      familia_notas: 'chocolate_caramelo',
      notas: 'Caramelo, Naranja, Chocolate con leche',
      altitud: 1750,
      secado: 'Marquesina comunal, 15 días',
      cosecha: 'Mayo de 2026',
      puntaje: 85,
      tueste: 'medio',
      precio_250: 42000,
      precio_500: 78000,
      precio_1kg: 148000,
      disponible: true,
      destacado: true,
      orden: 4,
    },
  },
  {
    slug: 'la-cumbre-honey',
    values: {
      nombre: 'La Cumbre',
      lote: '15',
      resumen: 'Honey de Gaitania, Tolima: mora, panela y almendra, con un cuerpo redondo.',
      descripcion:
        '<p>Don José Libardo deja la mitad del mucílago y seca el grano en camas elevadas durante 20 días. El café baja de la finca en mula y llega a Bogotá en sacos de fique.</p>' +
        '<p>Lo tostamos medio claro. Es el más dulce de la tienda, y el que recomendamos a quien está pasando del café de supermercado al de origen.</p>',
      preparacion:
        'V60 | 15 g de café, 250 ml de agua a 93 °C, 2:50 de tiempo total.\nPrensa francesa | 30 g, 500 ml a 94 °C, 4 minutos.',
      foto: { media: 'proceso-camas-secado' },
      galeria: [
        { media: 'proceso-camas-secado' },
        { media: 'origen-tolima' },
        { media: 'retrato-caficultor' },
        { media: 'taller-tostadora' },
      ],
      origen: 'la-cumbre',
      region: 'tolima',
      municipio: 'Planadas',
      productor: 'José Libardo Ramírez',
      variedad: 'varias',
      variedad_detalle: 'Caturra y Colombia',
      proceso: 'honey',
      proceso_detalle: 'Mucílago medio',
      familia_notas: 'frutal',
      notas: 'Mora, Panela, Almendra',
      altitud: 1820,
      secado: 'Camas elevadas, 20 días',
      cosecha: 'Mayo de 2026',
      puntaje: 85.5,
      tueste: 'medio_claro',
      precio_250: 46000,
      precio_500: 86000,
      precio_1kg: 162000,
      disponible: true,
      destacado: false,
      orden: 5,
    },
  },
  {
    slug: 'mananera',
    values: {
      nombre: 'Mañanera',
      lote: '21',
      resumen:
        'Nuestra mezcla de diario, de Huila y Tolima: chocolate, nuez y panela, para greca o con leche.',
      descripcion:
        '<p>Mezclamos Castillo lavado de La Esperanza y de La Cumbre, los lotes que no entran en las ediciones de una sola finca pero que pasan la misma catación. Sale siempre con más de 84 puntos.</p>' +
        '<p>La tostamos medio, un poco más largo que los lotes de origen, para que aguante la greca y la leche.</p>',
      preparacion:
        'Greca | Molienda media fina, fuego bajo y retirar apenas empiece a gorgotear.\nPrensa francesa | 30 g, 500 ml a 94 °C, 4 minutos.\nCon leche | 18 g de espresso y 150 ml de leche a 60 °C.',
      foto: { media: 'producto-bolsa-1kg-greca' },
      galeria: [
        { media: 'producto-bolsa-1kg-greca' },
        { media: 'taller-enfriamiento' },
        { media: 'origen-huila' },
        { media: 'origen-tolima' },
      ],
      origen: 'la-esperanza',
      region: 'varias',
      municipio: 'Pitalito y Planadas',
      productor: 'Luz Marina Cuéllar y José Libardo Ramírez',
      variedad: 'castillo',
      proceso: 'lavado',
      proceso_detalle: 'Mezcla de dos lavados',
      familia_notas: 'chocolate_caramelo',
      notas: 'Chocolate, Nuez, Panela',
      altitud: 1800,
      secado: 'Marquesina, 15 a 18 días',
      cosecha: 'Mayo de 2026',
      puntaje: 84,
      tueste: 'medio',
      precio_250: 36000,
      precio_500: 66000,
      precio_1kg: 124000,
      disponible: true,
      destacado: false,
      orden: 6,
    },
  },
]
