#!/usr/bin/env node

/**
 * Script para verificar la configuración de multi-dominio
 *
 * Ejecutar con: node scripts/test-subdomain-config.js
 */

const https = require('https');
const http = require('http');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Verificar variables de entorno
function checkEnvironmentVariables() {
  logSection('📋 VERIFICANDO VARIABLES DE ENTORNO');

  const requiredVars = {
    'NEXT_PUBLIC_ROOT_DOMAIN': process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
    'NEXT_PUBLIC_API_MEDIA': process.env.NEXT_PUBLIC_API_MEDIA,
    'DOMAIN_CHECK_SECRET_KEY': process.env.DOMAIN_CHECK_SECRET_KEY,
  };

  let allSet = true;

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      logError(`${key} no está configurada`);
      allSet = false;
    } else {
      if (key === 'DOMAIN_CHECK_SECRET_KEY') {
        logSuccess(`${key}: SET (oculto por seguridad)`);
      } else {
        logSuccess(`${key}: ${value}`);
      }
    }
  }

  return allSet;
}

// Verificar configuración de archivos
function checkFileStructure() {
  logSection('📁 VERIFICANDO ESTRUCTURA DE ARCHIVOS');

  const fs = require('fs');
  const path = require('path');

  const requiredFiles = [
    'src/middleware.ts',
    'src/app/s/[subdomain]/page.tsx',
    'src/app/s/[subdomain]/layout.tsx',
    'src/app/api/debug-subdomain/route.ts',
    'next.config.js',
  ];

  let allExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      logSuccess(`${file}`);
    } else {
      logError(`${file} no existe`);
      allExist = false;
    }
  }

  return allExist;
}

// Test de conectividad con el backend
async function testBackendConnectivity() {
  logSection('🔌 VERIFICANDO CONECTIVIDAD CON BACKEND');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.DOMAIN_CHECK_SECRET_KEY;

  if (!apiUrl) {
    logError('NEXT_PUBLIC_API_URL no está configurada');
    return false;
  }

  const testDomain = 'test-connectivity';
  const url = `${apiUrl}/companies/public/domains/validate/?domain=${testDomain}`;

  logInfo(`Probando: ${url}`);

  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Domain-Check-Key': secretKey,
      },
      timeout: 5000,
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            logSuccess(`Backend respondió correctamente (${res.statusCode})`);
            logInfo(`Respuesta: ${JSON.stringify(response, null, 2)}`);
            resolve(true);
          } else if (res.statusCode === 401) {
            logError(`Backend rechazó la petición (401 Unauthorized)`);
            logWarning('Verifica que DOMAIN_CHECK_SECRET_KEY coincida con Django');
            resolve(false);
          } else {
            logWarning(`Backend respondió con código: ${res.statusCode}`);
            logInfo(`Respuesta: ${JSON.stringify(response, null, 2)}`);
            resolve(false);
          }
        } catch (error) {
          logError(`Error parseando respuesta: ${error.message}`);
          logInfo(`Respuesta raw: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      logError(`Error conectando con backend: ${error.message}`);
      logWarning('Verifica que tu backend Django esté corriendo');
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      logError('Timeout conectando con backend (>5s)');
      logWarning('El backend tarda mucho en responder o no está disponible');
      resolve(false);
    });

    req.end();
  });
}

// Verificar configuración de next.config.js
function checkNextConfig() {
  logSection('⚙️  VERIFICANDO next.config.js');

  const fs = require('fs');
  const path = require('path');

  const configPath = path.join(process.cwd(), 'next.config.js');

  if (!fs.existsSync(configPath)) {
    logError('next.config.js no existe');
    return false;
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');

  // Verificar que output: 'standalone' esté comentado
  if (configContent.includes("output: 'standalone'") &&
      !configContent.match(/\/\/.*output:\s*['"]standalone['"]/)) {
    logWarning("output: 'standalone' está activo - puede causar problemas con multi-domain");
    logInfo('Considera comentarlo si tienes problemas');
  } else {
    logSuccess("Configuración de output correcta");
  }

  // Verificar que haya rewrites para /media
  if (configContent.includes('rewrites()')) {
    logSuccess('Configuración de rewrites encontrada');
  } else {
    logWarning('No se encontró configuración de rewrites - puede afectar imágenes');
  }

  return true;
}

// Mostrar resumen y próximos pasos
function showSummary(results) {
  logSection('📊 RESUMEN');

  const allPassed = Object.values(results).every(v => v === true);

  if (allPassed) {
    logSuccess('¡Todas las verificaciones pasaron!');
    console.log('\n🚀 Próximos pasos para Vercel:\n');
    log('1. Configura las variables de entorno en Vercel', 'yellow');
    log('   - Settings > Environment Variables', 'yellow');
    log('   - Copia las variables de .env.vercel.example', 'yellow');
    console.log();
    log('2. Configura los dominios en Vercel', 'yellow');
    log('   - Settings > Domains', 'yellow');
    log('   - Agrega: inmosite.com y *.inmosite.com', 'yellow');
    console.log();
    log('3. Configura los DNS', 'yellow');
    log('   - A record: @ -> IP de Vercel', 'yellow');
    log('   - CNAME record: * -> cname.vercel-dns.com', 'yellow');
    console.log();
    log('4. Redeploy en Vercel', 'yellow');
    console.log();
    log('📖 Ver SOLUCION_MULTI_DOMINIO_VERCEL.md para más detalles', 'cyan');
  } else {
    logError('Algunas verificaciones fallaron');
    console.log('\n⚠️  Soluciona los problemas arriba antes de deployar a Vercel\n');
  }
}

// Ejecutar todas las verificaciones
async function runAllTests() {
  console.clear();
  log('🔍 VERIFICACIÓN DE CONFIGURACIÓN MULTI-DOMINIO', 'cyan');
  log('='.repeat(60), 'cyan');

  const results = {};

  results.envVars = checkEnvironmentVariables();
  results.fileStructure = checkFileStructure();
  results.nextConfig = checkNextConfig();
  results.backend = await testBackendConnectivity();

  showSummary(results);
}

// Ejecutar
runAllTests().catch((error) => {
  logError(`Error ejecutando verificaciones: ${error.message}`);
  process.exit(1);
});
