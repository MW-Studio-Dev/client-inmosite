const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public');

// Tamaños estándar para favicons
const sizes = [16, 32, 48, 64, 128, 256];

async function generateFavicons() {
  console.log('Generando favicons...');

  try {
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

    // Generar ICO multi-resolución
    console.log('\nPara generar el favicon.ico multi-resolución, usa una herramienta online:');
    console.log('1. Ve a https://www.favicon-generator.org/');
    console.log('2. Sube el archivo public/favicon-32x32.png o public/favicon-64x64.png');
    console.log('3. Descarga el favicon.ico generado');
    console.log('4. Reemplaza el archivo public/favicon.ico');

    console.log('\n✓ Favicons PNG generados exitosamente!');
  } catch (error) {
    console.error('Error generando favicons:', error.message);
    console.log('\nSi sharp no está instalado, ejecuta:');
    console.log('npm install sharp --save-dev');
  }
}

generateFavicons();
