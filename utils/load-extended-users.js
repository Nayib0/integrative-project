/**
 * Script to load extended users in Learnex
 * Run with: node load-extended-users.js
 */

const { loadExtendedData } = require('./server/seeders/load_extended_data');

console.log('🚀 Iniciando carga de usuarios extendidos para Learnex...');
console.log('📋 Estructura:');
console.log('   • Grados 1-11 (máximo 8 estudiantes por grado)');
console.log('   • Cada estudiante tiene su padre/madre asignado');
console.log('   • Profesores asignados por materias y grados');
console.log('   • Administradores del sistema');
console.log('');

loadExtendedData();