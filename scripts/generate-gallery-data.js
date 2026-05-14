const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const imagesRoot = path.join(root, 'assets', 'img');
const outputFile = path.join(root, 'data', 'data.js');

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const categoryMeta = {
  'boda civil': {
    slug: 'boda_civil',
    title: 'Boda Civil',
    description: 'Capturamos el amor y la elegancia de tu día especial en la boda civil.'
  },
  'boda religiosa': {
    slug: 'boda_religiosa',
    title: 'Boda Religiosa',
    description: 'Los momentos más sagrados de tu unión bendecidos por la fe.'
  },
  'xv años': {
    slug: 'xv',
    title: 'XV Años',
    description: 'Celebramos tu transición a la vida adulta con glamour y alegría.'
  },
  'ceremonias de fe/presenstacion': {
    slug: 'ceremonias_presentaciones',
    title: 'Presentaciones',
    description: 'El inicio de un nuevo capítulo lleno de fe y esperanza.'
  },
  'ceremonias de fe/bautizo': {
    slug: 'ceremonias_bautizos',
    title: 'Bautizos',
    description: 'Un momento sagrado que marcará la vida de tu pequeño para siempre.'
  },
  'ceremonias de fe/primera comunion': {
    slug: 'ceremonias_primeras_comuniones',
    title: 'Primeras Comuniones',
    description: 'Capturamos la pureza y alegría de este día tan especial.'
  },
  'propuesta de matrimonio': {
    slug: 'propuestas_matrimonio',
    title: 'Propuestas de Matrimonio',
    description: 'El momento perfecto donde dos corazones se unen.'
  },
  'sesion casual': {
    slug: 'sesion_casual',
    title: 'Sesión Casual',
    description: 'Sesiones naturales que reflejan tu estilo y personalidad.'
  },
  'sesion en pareja': {
    slug: 'sesion_pareja',
    title: 'Sesión en pareja',
    description: 'Amor, complicidad y momentos inseparables juntos.'
  },
  'sesion de cumpleanos': {
    slug: 'sesion_cumpleanos',
    title: 'Sesión de cumpleaños',
    description: 'Celebramos tu vida con fotografías llenas de alegría y color.'
  },
  'sesion newborn': {
    slug: 'sesion_newborn',
    title: 'Sesión NewBorn',
    description: 'La ternura infinita de los primeros días de vida.'
  },
  'sesion prenatal': {
    slug: 'sesion_prenatal',
    title: 'Sesión Prenatal',
    description: 'La belleza de la espera y el amor que crece.'
  },
  'sesiones familiares': {
    slug: 'sesiones_familiares',
    title: 'Sesiones Familiares',
    description: 'Momentos auténticos de una familia unida y feliz.'
  },
  'sesiones infantiles': {
    slug: 'sesiones_infantiles',
    title: 'Sesiones Infantiles',
    description: 'La magia y curiosidad de la infancia capturada.'
  },
  'sesiones de estudio': {
    slug: 'sesiones_estudio',
    title: 'Sesiones en Estudio',
    description: 'Retratos profesionales con estilo y elegancia.'
  }
};

function normalizeFolderName(folder) {
  return folder.toLowerCase().replace(/\\/g, '/').replace(/\s+/g, ' ').trim();
}

function walkDirectory(dir, relativeDir = '') {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const currentRelative = relativeDir ? path.posix.join(relativeDir, entry.name) : entry.name;

    if (entry.isDirectory()) {
      items.push(...walkDirectory(fullPath, currentRelative));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.has(ext)) {
        items.push({ relative: currentRelative, fullPath });
      }
    }
  }

  return items;
}

function groupImagesByCategory(files) {
  const categories = {};

  for (const file of files) {
    const folder = path.posix.dirname(file.relative);
    const normalizedFolder = normalizeFolderName(folder);
    const meta = categoryMeta[normalizedFolder];

    if (!meta) {
      console.warn(`Carpeta no reconocida, se omite: ${folder}`);
      continue;
    }

    if (!categories[meta.slug]) {
      categories[meta.slug] = {
        title: meta.title,
        description: meta.description,
        folder: folder,
        files: []
      };
    }

    categories[meta.slug].files.push(path.basename(file.relative));
  }

  for (const slug in categories) {
    categories[slug].files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }

  return categories;
}

function buildOutput(categories) {
  const lines = [];
  lines.push('// ESTE ARCHIVO SE GENERA AUTOMÁTICAMENTE. No edites directamente.');
  lines.push('// Ejecuta: node scripts/generate-gallery-data.js');
  lines.push('');
  lines.push('const categoryData = {');

  for (const [slug, data] of Object.entries(categories)) {
    const folder = data.folder.replace(/\\/g, '/');
    lines.push(`  ${JSON.stringify(slug)}: {`);
    lines.push(`    title: ${JSON.stringify(data.title)},`);
    lines.push(`    description: ${JSON.stringify(data.description)},`);
    lines.push(`    folder: ${JSON.stringify(folder)},`);
    lines.push('    files: [');
    for (const fileName of data.files) {
      lines.push(`      ${JSON.stringify(fileName)},`);
    }
    lines.push('    ]');
    lines.push('  },');
  }

  lines.push('};');
  lines.push('');
  lines.push('const categoryTitles = Object.fromEntries(');
  lines.push('  Object.entries(categoryData).map(([key, data]) => [key, data.title])');
  lines.push(');');
  lines.push('');
  lines.push('const categoryDescriptions = Object.fromEntries(');
  lines.push('  Object.entries(categoryData).map(([key, data]) => [key, data.description])');
  lines.push(');');
  lines.push('');
  lines.push('const MEDIA = Object.entries(categoryData).flatMap(([category, data]) =>');
  lines.push('  data.files.map((fileName) => ({');
  lines.push("    type: 'image',");
  lines.push('    src: `assets/img/${data.folder}/${fileName}`');
  lines.push('      .replace(/\\\\/g, "/"),');
  lines.push('    title: categoryTitles[category],');
  lines.push('    description: categoryDescriptions[category],');
  lines.push('    categoria: category');
  lines.push('  }))');
  lines.push(');');
  lines.push('');

  return lines.join('\n');
}

function writeOutput(categories) {
  const content = buildOutput(categories);
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`Se generó ${outputFile} con ${Object.keys(categories).length} categorías.`);
}

function main() {
  if (!fs.existsSync(imagesRoot)) {
    console.error(`No se encontró la carpeta de imágenes: ${imagesRoot}`);
    process.exit(1);
  }

  const files = walkDirectory(imagesRoot);
  const categories = groupImagesByCategory(files);
  writeOutput(categories);
}

main();
