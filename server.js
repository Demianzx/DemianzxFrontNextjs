const { execSync } = require('child_process');

// Obtener el puerto de la variable de entorno PORT o usar 3000 como valor predeterminado
const port = process.env.PORT || 3001;

try {
  // Ejecutar next start con el puerto especificado
  execSync(`npx next start -p ${port}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error al iniciar el servidor Next.js:', error);
  process.exit(1);
}