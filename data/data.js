const categoryTitles = {
  boda_civil: 'Boda Civil',
  boda_religiosa: 'Boda Religiosa',
  xv: 'XV Años',
  ceremonias_presentaciones: 'Presentaciones',
  ceremonias_bautizos: 'Bautizos',
  ceremonias_primeras_comuniones: 'Primeras Comuniones',
  propuestas_matrimonio: 'Propuesta de matrimonio',
  sesion_casual: 'Sesión Casual',
  sesion_pareja: 'Sesión en pareja',
  sesion_cumpleanos: 'Sesión de cumpleaños',
  sesion_newborn: 'Sesión NewBorn',
  sesion_prenatal: 'Sesión Prenatal',
  sesiones_familiares: 'Sesiones Familiares',
  sesiones_infantiles: 'Sesiones Infantiles',
  sesiones_estudio: 'Sesiones en Estudio'
};

const range = (start, end, ext = 'jpeg') =>
  Array.from({ length: end - start + 1 }, (_, i) => `${start + i}.${ext}`);

const buildImages = (category, folder, files) =>
  files.map((fileName) => ({
    type: 'image',
    src: `assets/img/${folder}/${fileName}`,
    title: categoryTitles[category],
    categoria: category
  }));

const MEDIA = [
  ...buildImages('boda_civil', 'Boda Civil', ['1.jpeg', '2.jpg', ...range(3, 31)]),
  ...buildImages('boda_religiosa', 'Boda Religiosa', range(1, 31)),
  ...buildImages('xv', 'XV años', range(1, 22)),
  ...buildImages('ceremonias_presentaciones', 'Ceremonias de Fe/Presenstacion', range(1, 16)),
  ...buildImages('ceremonias_bautizos', 'Ceremonias de Fe/Bautizo', ['001.jpg', ...range(1, 24)]),
  ...buildImages('ceremonias_primeras_comuniones', 'Ceremonias de Fe/Primera Comunion', range(1, 11)),
  ...buildImages('propuestas_matrimonio', 'Propuesta de matrimonio', range(1, 16)),
  ...buildImages('sesion_casual', 'Sesion Casual', range(3, 17)),
  ...buildImages('sesion_pareja', 'Sesion en Pareja', range(1, 17)),
  ...buildImages('sesion_cumpleanos', 'Sesion de cumpleanos', range(1, 14)),
  ...buildImages('sesion_newborn', 'Sesion NewBorn', range(1, 22)),
  ...buildImages('sesion_prenatal', 'Sesion Prenatal', range(1, 22)),
  ...buildImages('sesiones_familiares', 'Sesiones Familiares', range(1, 12)),
  ...buildImages('sesiones_infantiles', 'Sesiones infantiles', range(1, 17)),
  ...buildImages('sesiones_estudio', 'Sesiones de Estudio', range(1, 14))
];
