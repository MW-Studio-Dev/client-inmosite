const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/faviconPrincipal.png');
const outputDir = path.join(__dirname, '../public');

// Tamaños para favicons - usaremos tamaños más grandes para mejor visualización
const sizes = [16, 32, 48, 64, 128, 256];

async function optimizeFavicon() {
  console.log('Optimizando favicon desde faviconPrincipal.png...\n');

  try {
    // Leer la imagen original
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Imagen original: ${metadata.width}x${metadata.height}`);

    // Primero, recortar la imagen para que sea cuadrada (centrada)
    const size = Math.min(metadata.width, metadata.height);
    const left = Math.floor((metadata.width - size) / 2);
    const top = Math.floor((metadata.height - size) / 2);

    console.log(`Recortando a ${size}x${size} (centrado)...\n`);

    // Recortar la imagen de forma cuadrada
    const croppedImage = await image
      .extract({
        left: left,
        top: top,
        width: size,
        height: size
      })
      .toBuffer();

    // Generar PNG de diferentes tamaños con mejor calidad
    for (const targetSize of sizes) {
      await sharp(croppedImage)
        .resize(targetSize, targetSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // Fondo transparente
          kernel: sharp.kernel.lanczos3 // Mejor algoritmo de redimensionamiento
        })
        .png({
          compressionLevel: 9,
          quality: 100
        })
        .toFile(path.join(outputDir, `favicon-${targetSize}x${targetSize}.png`));

      console.log(`✓ favicon-${targetSize}x${targetSize}.png generado (optimizado)`);
    }

    console.log('\n✓ Favicons optimizados generados exitosamente!');
    console.log('\nConsejos adicionales:');
    console.log('1. Si el favicon sigue viéndose pequeño, considera crear una versión');
    console.log('   simplificada del logo con menos detalles para tamaños pequeños.');
    console.log('2. Los navegadores limitan el tamaño del favicon en las pestañas.');
    console.log('3. Reinicia el servidor y limpia la caché del navegador.');
  } catch (error) {
    console.error('Error optimizando favicon:', error.message);
  }
}

optimizeFavicon();
