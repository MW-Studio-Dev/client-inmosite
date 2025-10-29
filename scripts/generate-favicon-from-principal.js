const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/faviconPrincipal.png');
const outputDir = path.join(__dirname, '../public');

// Tamaños estándar para favicons
const sizes = [16, 32, 48, 64, 128, 256];

async function generateFavicons() {
  console.log('Generando favicons desde faviconPrincipal.png...');

  try {
    // Verificar que existe el archivo
    if (!fs.existsSync(inputPath)) {
      console.error('Error: No se encontró el archivo faviconPrincipal.png');
      return;
    }

    // Generar PNG de diferentes tamaños
    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(outputDir, `favicon-${size}x${size}.png`));

      console.log(`✓ favicon-${size}x${size}.png generado`);
    }

    console.log('\n✓ Favicons PNG generados exitosamente desde faviconPrincipal.png!');
    console.log('\nLos nuevos favicons se han generado en /public/');
    console.log('Reinicia el servidor para ver los cambios.');
  } catch (error) {
    console.error('Error generando favicons:', error.message);
  }
}

generateFavicons();
