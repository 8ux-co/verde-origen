import type { Entry } from '../types'

/** `{{figure:<photo>|<caption>}}` becomes a captioned image in the seed. */
const figure = (photo: string, caption: string) => `{{figure:${photo}|${caption}}}`

export const PERSONAS: Entry[] = [
  {
    slug: 'andres-gaitan',
    values: {
      nombre: 'Andrés Gaitán',
      cargo: 'Tostador y fundador',
      foto: { media: 'taller-tostadora' },
      bio: 'Fue barista ocho años antes de tostar su primer kilo. Tuesta los lunes y los jueves, y escribe sobre recetas y curvas de tueste.',
      en_equipo: true,
      orden: 1,
    },
  },
  {
    slug: 'camila-restrepo',
    values: {
      nombre: 'Camila Restrepo',
      cargo: 'Compras y calidad',
      foto: { media: 'taller-catacion' },
      bio: 'Compra y cata todo lo que tostamos. Pasa unas diez semanas al año en fincas de Huila y Nariño, y el resto en la mesa de catación del taller.',
      en_equipo: true,
      orden: 2,
    },
  },
  {
    slug: 'daniela-mora',
    values: {
      nombre: 'Daniela Mora',
      cargo: 'Diario y comunidad',
      foto: null,
      bio: 'Escribe el diario y hace las fotos de las fincas. Coordina las visitas de cosecha y el boletín.',
      en_equipo: true,
      orden: 3,
    },
  },
  {
    slug: 'ana-rodriguez',
    values: {
      nombre: 'Ana Rodríguez',
      cargo: 'Pedidos y atención',
      foto: { media: 'equipo-sellando' },
      bio: 'Empaca, despacha y responde el WhatsApp. Sabe qué molienda pide cada cliente de memoria.',
      en_equipo: true,
      orden: 4,
    },
  },
]

export const BLOG: Entry[] = [
  {
    slug: 'pink-bourbon-36-horas',
    values: {
      titulo: 'Por qué nuestro Pink Bourbon pasa 36 horas fermentando',
      extracto:
        'Probamos 12, 24 y 36 horas con Hernán Claros en Acevedo. Esto es lo que cambió en la taza, y lo que no.',
      portada: { media: 'proceso-fermentacion' },
      portada_pie: 'Tanques de fermentación en El Mirador, Acevedo. Foto: Daniela Mora.',
      cuerpo:
        '<p>En junio, Hernán Claros nos mandó tres bolsas de muestra de El Mirador, todas de la misma recolección de Pink Bourbon. Lo único que cambiaba era el tiempo que la cereza pasó en tanque cerrado antes de despulpar: 12, 24 y 36 horas.</p>' +
        '<p>Las catamos a ciegas en el taller, tres veces y con dos semanas de diferencia. Esto es lo que encontramos, y por qué el lote 12 de esta cosecha salió con 36 horas.</p>' +
        '<h2>Qué pasa dentro del tanque</h2>' +
        '<p>Hernán recoge solo cereza madura, entre 22 y 24 grados Brix medidos con un refractómetro de mano. La deja en tanques plásticos sellados, a la sombra, donde la temperatura se queda entre 18 y 20 °C. Las levaduras que ya trae la cáscara empiezan a consumir los azúcares del mucílago; sin oxígeno, el proceso va lento y se puede controlar.</p>' +
        '<blockquote><p>A las 36 horas la taza dejó de saber a lavado y empezó a saber a guayaba.</p></blockquote>' +
        '<p>La diferencia no está en la cereza sino en el tiempo: con la misma fruta, el mismo secado y el mismo tueste, cada muestra contaba algo distinto.</p>' +
        figure('retrato-caficultor', 'Hernán mide los grados Brix antes de cerrar cada tanque.') +
        '<h2>Lo que cambió en la taza</h2>' +
        '<ul>' +
        '<li><strong>12 horas.</strong> Limpio, panela y algo de limón. Muy parecido a un lavado tradicional.</li>' +
        '<li><strong>24 horas.</strong> Aparece la fruta roja y la acidez se vuelve más redonda.</li>' +
        '<li><strong>36 horas.</strong> Guayaba, jazmín y un cuerpo más sedoso. Es la que elegimos los tres.</li>' +
        '</ul>' +
        '<h2>Por qué no más</h2>' +
        '<p>Más fermentación no es mejor por sí sola. En una prueba aparte de 48 horas, la taza perdió limpieza y dos de tres catadores la marcaron con un defecto avinagrado. Las 36 horas son el punto donde la fruta sube sin ensuciar la taza, y es lo que Hernán puede repetir en cada tanda.</p>' +
        '<p>Del lote 12 quedan 38 kg. Lo tostamos claro, los lunes.</p>',
      categoria: 'proceso',
      autor: 'camila-restrepo',
      fecha: '2026-09-28',
      lectura_min: 7,
      destacado: true,
      cafe_relacionado: 'el-mirador-pink-bourbon',
    },
  },
  {
    slug: 'v60-lavados-de-altura',
    values: {
      titulo: 'V60 para lavados de altura: 15 g, 250 ml y 93 °C',
      extracto:
        'La receta que usamos en el taller para La Esperanza y Villa Rica, paso a paso y con los errores más comunes.',
      portada: { media: 'blog-v60' },
      portada_pie: 'El V60 del taller sobre la balanza. Foto: Daniela Mora.',
      cuerpo:
        '<p>Los lavados de altura tienen una acidez que se pierde fácil si el agua está muy caliente o la molienda muy fina. Esta es la receta con la que catamos La Esperanza y Villa Rica todos los lunes.</p>' +
        '<h2>Lo que necesitas</h2>' +
        '<ul><li><strong>15 g de café</strong>, molienda media, como sal de mar fina.</li><li><strong>250 ml de agua</strong> a 93 °C: un minuto después de que hierva.</li><li>Una balanza con temporizador.</li></ul>' +
        '<h2>Paso a paso</h2>' +
        '<p>Enjuaga el filtro con agua caliente y bota esa agua. Sirve 40 ml para el florecimiento y espera 40 segundos. Luego sirve en espiral, sin tocar el papel, hasta 150 ml al minuto y 250 ml al minuto y medio. El café debe terminar de bajar entre 2:30 y 2:50.</p>' +
        '<blockquote><p>Si baja en menos de dos minutos, muele más fino. Si pasa de tres, más grueso. No cambies dos cosas a la vez.</p></blockquote>' +
        '<h2>Los errores más comunes</h2>' +
        '<p>Agua hirviendo, que amarga el final de la taza; café molido hace una semana, que llega plano; y servir todo el agua de una vez, que deja el centro del filtro seco.</p>',
      categoria: 'preparacion',
      autor: 'andres-gaitan',
      fecha: '2026-09-22',
      lectura_min: 5,
      destacado: false,
      cafe_relacionado: 'la-esperanza-lote-07',
    },
  },
  {
    slug: 'una-semana-en-buesaco',
    values: {
      titulo: 'Una semana en Buesaco durante la cosecha',
      extracto:
        'Recolección a 2.100 metros, secado lento y la conversación que nos llevó a comprar el Geisha de los Delgado.',
      portada: { media: 'origen-narino' },
      portada_pie: 'El cañón del Juanambú desde Los Andes. Foto: Daniela Mora.',
      cuerpo:
        '<p>Llegué a Buesaco un lunes de junio, con lluvia. Don Arturo Delgado me recogió en el parque y subimos 9 kilómetros de carretera destapada hasta Los Andes, con el cañón del Juanambú a la izquierda todo el camino.</p>' +
        '<h2>Recoger a 2.100 metros</h2>' +
        '<p>A esta altura la cereza madura despacio y de forma desigual: en la misma rama hay granos rojos, pintones y verdes. La familia recoge en pases cortos, cada ocho días, y solo lo que está rojo.</p>' +
        '<blockquote><p>Aquí el café no se apura. El que se apura, lo pierde en el secado.</p></blockquote>' +
        '<h2>El lote de Geisha</h2>' +
        '<p>El último día, Rosalba nos sirvió una taza del Geisha natural que secaban aparte, en camas bajo techo. Lo catamos esa noche en la cocina, con cucharas prestadas. Al volver a Bogotá le escribimos para comprar todo el lote del año siguiente.</p>',
      categoria: 'origen',
      autor: 'daniela-mora',
      fecha: '2026-09-14',
      lectura_min: 9,
      destacado: false,
      cafe_relacionado: 'los-andes-geisha',
    },
  },
  {
    slug: 'como-leemos-una-curva-de-tueste',
    values: {
      titulo: 'Cómo leemos una curva de tueste',
      extracto:
        'Primer crack, tiempo de desarrollo y por qué tostamos los naturales un poco más despacio.',
      portada: { media: 'taller-tostadora' },
      portada_pie: 'El registro de tueste junto a la tostadora de 12 kg. Foto: Daniela Mora.',
      cuerpo:
        '<p>Cada tanda que sale de la tostadora deja una curva: la temperatura del grano minuto a minuto. La guardamos todas, y cuando un lote sabe distinto, es lo primero que miramos.</p>' +
        '<h2>Tres momentos</h2>' +
        '<ul><li><strong>El punto de giro.</strong> Al cargar el grano frío, la temperatura cae y luego vuelve a subir. Ahí empieza a contar el tueste.</li><li><strong>El primer crack.</strong> El grano suena como maíz pira. Pasa entre los 8 y 9 minutos en nuestros lotes.</li><li><strong>El desarrollo.</strong> Lo que pasa entre el primer crack y la descarga. Para un tueste claro, entre 1:30 y 2 minutos.</li></ul>' +
        '<h2>Por qué los naturales van más despacio</h2>' +
        '<p>Un natural trae más azúcares en la superficie del grano y se quema antes. Por eso le bajamos el fuego un minuto antes del primer crack: alarga el desarrollo sin oscurecer la taza.</p>',
      categoria: 'tostion',
      autor: 'andres-gaitan',
      fecha: '2026-09-02',
      lectura_min: 6,
      destacado: false,
      cafe_relacionado: 'los-andes-geisha',
    },
  },
  {
    slug: 'que-significa-honey',
    values: {
      titulo: 'Qué significa honey, y por qué no lleva miel',
      extracto:
        'El mucílago que se queda pegado al grano, cuánto se deja y qué le hace al dulzor de la taza.',
      portada: { media: 'proceso-camas-secado' },
      portada_pie: 'Honey secando en camas elevadas. Foto: Daniela Mora.',
      cuerpo:
        '<p>Honey es el nombre que se le da al café despulpado que se seca con parte del mucílago, esa capa pegajosa y dulce que envuelve el grano. Al tacto se siente como miel; de ahí el nombre.</p>' +
        '<h2>Cuánto mucílago</h2>' +
        '<p>Se habla de honey amarillo, rojo o negro según cuánto mucílago se deja y cuánto tarda en secar. En La Cumbre y El Mirador dejan cerca de la mitad, y secan en camas elevadas para que el aire pase por debajo.</p>' +
        '<blockquote><p>El honey hay que moverlo como si fuera arroz en la olla: si se pega, se daña.</p></blockquote>' +
        '<h2>Qué le hace a la taza</h2>' +
        '<p>Más dulzor y más cuerpo que un lavado de la misma finca, con una acidez más suave. El riesgo es el secado: si llueve y el grano se apelmaza, aparecen sabores a fermento.</p>',
      categoria: 'proceso',
      autor: 'camila-restrepo',
      fecha: '2026-08-25',
      lectura_min: 4,
      destacado: false,
      cafe_relacionado: 'la-cumbre-honey',
    },
  },
  {
    slug: 'el-agua-de-bogota',
    values: {
      titulo: 'El agua de Bogotá y tu café: qué filtrar y qué no',
      extracto: 'Medimos el agua de cinco barrios. La del grifo sirve, con un cambio pequeño.',
      portada: { media: 'taller-catacion' },
      portada_pie: 'Catación con agua de cinco barrios en el taller. Foto: Daniela Mora.',
      cuerpo:
        '<p>Un café filtrado es 98 % agua. Si el agua sabe a cloro o es muy dura, ningún lote sale bien. Así que medimos la de cinco barrios: Chapinero, Suba, Kennedy, Usaquén y La Candelaria.</p>' +
        '<h2>Lo que encontramos</h2>' +
        '<p>El agua de Bogotá es blanda en general, entre 40 y 70 partes por millón de dureza, que es un buen rango para café. El problema es el cloro, sobre todo por la mañana.</p>' +
        '<h2>El cambio pequeño</h2>' +
        '<p>Deja el agua en una jarra abierta la noche anterior, o pásala por un filtro de carbón de jarra. Con eso basta. No uses agua destilada: sin minerales, el café sale plano.</p>',
      categoria: 'preparacion',
      autor: 'ana-rodriguez',
      fecha: '2026-08-18',
      lectura_min: 5,
      destacado: false,
      cafe_relacionado: 'villa-rica-castillo',
    },
  },
  {
    slug: 'diez-familias-de-inza',
    values: {
      titulo: 'Diez familias de Inzá y el secado en marquesina',
      extracto:
        'Cómo el Grupo Villa Rica pasó de secar en el patio a secar bajo techo, y lo que eso hizo con su precio.',
      portada: { media: 'origen-cauca' },
      portada_pie: 'La marquesina comunal de Villa Rica. Foto: Daniela Mora.',
      cuerpo:
        '<p>Hasta 2021, las diez familias del Grupo Villa Rica secaban el café en el patio de cada casa, sobre lonas, y lo tapaban cada vez que llovía. En Tierradentro llueve casi todas las tardes.</p>' +
        '<h2>Una marquesina para todos</h2>' +
        '<p>Juntaron lo de dos cosechas para construir una marquesina comunal de 200 metros cuadrados, con techo plástico y camas de malla. Rosa Elvira Yace lleva el turno de cada familia en un cuaderno.</p>' +
        '<blockquote><p>Antes vendíamos el café por kilos. Ahora lo vendemos por lo que sabe.</p></blockquote>' +
        '<h2>Lo que cambió</h2>' +
        '<p>El café seco bajo techo pasó de 80 a 85 puntos en nuestra catación. Desde 2022 les compramos el lote completo, y pagamos 30 % sobre el precio base de la Federación.</p>',
      categoria: 'origen',
      autor: 'daniela-mora',
      fecha: '2026-08-04',
      lectura_min: 8,
      destacado: false,
      cafe_relacionado: 'villa-rica-castillo',
    },
  },
  {
    slug: 'greca-sin-sabor-a-quemado',
    values: {
      titulo: 'Greca sin sabor a quemado',
      extracto:
        'Fuego bajo, agua caliente desde el principio y retirarla a tiempo. Tres cambios y la greca de la casa sabe a otra cosa.',
      portada: { media: 'producto-bolsa-1kg-greca' },
      portada_pie: 'La greca de la cocina de Ana. Foto: Daniela Mora.',
      cuerpo:
        '<p>La greca es la cafetera de casi todas las casas colombianas, y casi siempre se usa a fuego alto. El resultado es un café amargo que sabe a quemado, aunque el grano sea bueno.</p>' +
        '<h2>Tres cambios</h2>' +
        '<ul><li><strong>Agua caliente.</strong> Llena la base con agua que ya hirvió: el café pasa menos tiempo sobre el fuego.</li><li><strong>Fuego bajo.</strong> La llama no debe salirse de la base.</li><li><strong>Retirar a tiempo.</strong> Apenas empiece a gorgotear, quítala del fuego y pasa el café a una taza.</li></ul>' +
        '<p>Con la Mañanera, molida media fina, la diferencia se nota desde la primera taza.</p>',
      categoria: 'preparacion',
      autor: 'ana-rodriguez',
      fecha: '2026-07-21',
      lectura_min: 4,
      destacado: false,
      cafe_relacionado: 'mananera',
    },
  },
  {
    slug: 'por-que-publicamos-el-precio',
    values: {
      titulo: 'Por qué publicamos lo que pagamos por cada lote',
      extracto:
        'El precio base de la Federación, lo que pagamos encima y por qué lo escribimos en la ficha de cada café.',
      portada: { media: 'origen-huila' },
      portada_pie: 'Cafetales de Huila en la tarde. Foto: Daniela Mora.',
      cuerpo:
        '<p>Cada mañana la Federación Nacional de Cafeteros publica un precio base por carga de 125 kilos de pergamino. Es la referencia de todo el café que se compra en Colombia ese día.</p>' +
        '<h2>Lo que pagamos encima</h2>' +
        '<p>Nunca pagamos menos de 25 % sobre ese precio, y en lotes de proceso, como el Pink Bourbon de El Mirador, llegamos a 60 %. Lo acordamos con cada productor antes de la cosecha, no después de catar.</p>' +
        '<blockquote><p>Un precio que no se puede decir en voz alta casi nunca es justo.</p></blockquote>' +
        '<h2>Por qué lo escribimos</h2>' +
        '<p>Porque quien compra una bolsa merece saber cuánto de su plata llega a la finca. Y porque los productores leen nuestro sitio: si cambiamos un precio, se enteran.</p>',
      categoria: 'origen',
      autor: 'camila-restrepo',
      fecha: '2026-07-07',
      lectura_min: 6,
      destacado: false,
      cafe_relacionado: 'la-esperanza-lote-07',
    },
  },
  {
    slug: 'enfriar-en-cuatro-minutos',
    values: {
      titulo: 'Por qué enfriamos el grano en cuatro minutos',
      extracto:
        'Lo que pasa en la bandeja de enfriamiento y por qué un minuto de más se nota en la taza.',
      portada: { media: 'taller-enfriamiento' },
      portada_pie: 'Grano recién tostado en la bandeja de enfriamiento. Foto: Daniela Mora.',
      cuerpo:
        '<p>Cuando el grano sale de la tostadora sigue tostándose por dentro. Si no se enfría rápido, el tueste que elegimos en la curva se corre medio punto hacia oscuro.</p>' +
        '<h2>La bandeja</h2>' +
        '<p>Nuestra bandeja tiene un ventilador por debajo y unos brazos que revuelven el grano. Con 12 kg, tarda cuatro minutos en bajar a temperatura de la mano.</p>' +
        '<p>En verano, cuando el taller está caliente, abrimos la puerta del patio durante el enfriamiento. Parece poco, pero son treinta segundos menos.</p>',
      categoria: 'tostion',
      autor: 'andres-gaitan',
      fecha: '2026-06-23',
      lectura_min: 3,
      destacado: false,
      cafe_relacionado: 'mananera',
    },
  },
]

const p = (text: string) => `<p>${text}</p>`

export const PREGUNTAS: Entry[] = [
  {
    slug: 'cuando-tuestan-y-despachan',
    values: {
      pregunta: '¿Cuándo tuestan y cuándo despachan?',
      respuesta: p(
        'Tostamos los lunes y los jueves. Los pedidos que llegan hasta el domingo salen el martes; los que llegan hasta el miércoles salen el viernes. Así ninguna bolsa espera más de un par de días en el taller.',
      ),
      tema: 'pedidos_envios',
      orden: 1,
    },
  },
  {
    slug: 'cuanto-cuesta-el-envio',
    values: {
      pregunta: '¿Cuánto cuesta el envío?',
      respuesta: p(
        'En Bogotá, $ 9.000; al resto del país, $ 14.000. Los pedidos desde $ 150.000 tienen envío gratis a cualquier ciudad.',
      ),
      tema: 'pedidos_envios',
      orden: 2,
    },
  },
  {
    slug: 'cuanto-tarda-en-llegar',
    values: {
      pregunta: '¿Cuánto tarda en llegar?',
      respuesta: p(
        'En Bogotá llega al día siguiente del despacho. A ciudades principales, de dos a tres días hábiles; a municipios, de tres a cinco. Te mandamos la guía por correo el día que sale.',
      ),
      tema: 'pedidos_envios',
      orden: 3,
    },
  },
  {
    slug: 'cambiar-la-molienda',
    values: {
      pregunta: '¿Puedo cambiar la molienda después de pagar?',
      respuesta: p(
        'Sí, hasta el día antes del tueste. Escríbenos por WhatsApp con el número de pedido y la molienda nueva. Después de tostado y molido ya no se puede cambiar.',
      ),
      tema: 'pedidos_envios',
      orden: 4,
    },
  },
  {
    slug: 'que-molienda-elijo',
    values: {
      pregunta: '¿Qué molienda elijo?',
      respuesta:
        p('Depende de cómo lo prepares:') +
        '<ul><li><strong>Filtro: V60 o Chemex.</strong> Media, como sal de mar fina.</li><li><strong>Prensa francesa.</strong> Gruesa.</li><li><strong>Espresso.</strong> Fina; mejor si la ajustas en tu molino.</li><li><strong>Greca o moka.</strong> Media fina.</li></ul>' +
        p('Si tienes molino, pide grano entero: dura fresco el doble.'),
      tema: 'cafe_preparacion',
      orden: 1,
    },
  },
  {
    slug: 'cuanto-dura-fresco',
    values: {
      pregunta: '¿Cuánto dura fresco el café?',
      respuesta: p(
        'En grano, de cuatro a seis semanas después del tueste, en la bolsa cerrada con la válvula. Molido, unas dos semanas. Guárdalo lejos de la luz y del calor, no en la nevera.',
      ),
      tema: 'cafe_preparacion',
      orden: 2,
    },
  },
  {
    slug: 'por-que-cambia-el-precio',
    values: {
      pregunta: '¿Por qué el precio cambia entre lotes?',
      respuesta: p(
        'Porque pagamos distinto a cada finca: depende de la altura, del proceso, de cuánto produce y de lo que acordamos antes de la cosecha. En la ficha de cada café contamos cuánto pagamos.',
      ),
      tema: 'cafe_preparacion',
      orden: 3,
    },
  },
  {
    slug: 'venden-a-cafeterias',
    values: {
      pregunta: '¿Venden a cafeterías?',
      respuesta: p(
        'Sí. Vendemos por kilo desde 5 kg al mes, con precio fijo por cosecha y una visita de calibración del molino incluida. Escríbenos a mayoristas@verdeorigen.co.',
      ),
      tema: 'mayoristas_visitas',
      orden: 1,
    },
  },
  {
    slug: 'visitar-el-taller',
    values: {
      pregunta: '¿Puedo visitar el taller?',
      respuesta: p(
        'Los sábados, de 9:00 a. m. a 2:00 p. m., en la Calle 59 # 13-27, Chapinero. Hay café filtrado gratis y puedes llevarte la bolsa recién tostada, sin envío.',
      ),
      tema: 'mayoristas_visitas',
      orden: 2,
    },
  },
]
