const categoryTitles = {
  boda_civil: 'Boda Civil',
  boda_religiosa: 'Boda Religiosa',
  xv: 'XV Años',
  ceremonias_presentaciones: 'Presentaciones',
  ceremonias_bautizos: 'Bautizos',
  ceremonias_primeras_comuniones: 'Primeras Comuniones',
  propuestas_matrimonio: 'Propuestas de Matrimonio',
  sesion_casual: 'Sesión Casual',
  sesion_pareja: 'Sesión en pareja',
  sesion_cumpleanos: 'Sesión de cumpleaños',
  sesion_newborn: 'Sesión NewBorn',
  sesion_prenatal: 'Sesión Prenatal',
  sesiones_familiares: 'Sesiones Familiares',
  sesiones_infantiles: 'Sesiones Infantiles',
  sesiones_estudio: 'Sesiones en Estudio'
};

const categoryDescriptions = {
  boda_civil: 'Capturamos el amor y la elegancia de tu día especial en la boda civil.',
  boda_religiosa: 'Los momentos más sagrados de tu unión bendecidos por la fe.',
  xv: 'Celebramos tu transición a la vida adulta con glamour y alegría.',
  ceremonias_presentaciones: 'El inicio de un nuevo capítulo lleno de fe y esperanza.',
  ceremonias_bautizos: 'Un momento sagrado que marcará la vida de tu pequeño para siempre.',
  ceremonias_primeras_comuniones: 'Capturamos la pureza y alegría de este día tan especial.',
  propuestas_matrimonio: 'El momento perfecto donde dos corazones se unen.',
  sesion_casual: 'Sesiones naturales que reflejan tu estilo y personalidad.',
  sesion_pareja: 'Amor, complicidad y momentos inseparables juntos.',
  sesion_cumpleanos: 'Celebramos tu vida con fotografías llenas de alegría y color.',
  sesion_newborn: 'La ternura infinita de los primeros días de vida.',
  sesion_prenatal: 'La belleza de la espera y el amor que crece.',
  sesiones_familiares: 'Momentos auténticos de una familia unida y feliz.',
  sesiones_infantiles: 'La magia y curiosidad de la infancia capturada.',
  sesiones_estudio: 'Retratos profesionales con estilo y elegancia.'
};

const range = (start, end, ext = 'jpeg') =>
  Array.from({ length: end - start + 1 }, (_, i) => `${start + i}.${ext}`);

const buildImages = (category, folder, files) =>
  files.map((fileName) => ({
    type: 'image',
    src: `assets/img/${folder}/${fileName}`,
    title: categoryTitles[category],
    description: categoryDescriptions[category],
    categoria: category
  }));

  

const MEDIA = [
  ...buildImages('boda_civil', 'Boda Civil', ['1.jpeg', '2.jpg', ...range(3, 31)]),
  ...buildImages('boda_religiosa', 'Boda Religiosa', range(1, 31)),
  ...buildImages('xv', 'XV años', range(1, 22)),
  ...buildImages('ceremonias_presentaciones', 'Ceremonias de Fe/Presenstacion', range(1, 16)),
  ...buildImages('ceremonias_bautizos', 'Ceremonias de Fe/Bautizo', ['001.jpg', ...range(1, 24)]),
  ...buildImages('ceremonias_primeras_comuniones', 'Ceremonias de Fe/Primera Comunion', range(1, 11)),
  ...buildImages('propuestas_matrimonio', 'Propuesta de Matrimonio', range(1, 16)),
  ...buildImages('sesion_casual', 'Sesion Casual', range(3, 17)),
  ...buildImages('sesion_pareja', 'Sesion en Pareja', range(1, 17)),
  ...buildImages('sesion_cumpleanos', 'Sesion de cumpleanos', range(1, 14)),
  ...buildImages('sesion_newborn', 'Sesion NewBorn', range(1, 22)),
  ...buildImages('sesion_prenatal', 'Sesion Prenatal', range(1, 22)),
  ...buildImages('sesiones_familiares', 'Sesiones Familiares', range(1, 18)),
  ...buildImages('sesiones_infantiles', 'Sesiones infantiles', range(1, 23)),
  ...buildImages('sesiones_estudio', 'Sesiones de Estudio', range(1, 14))
];
