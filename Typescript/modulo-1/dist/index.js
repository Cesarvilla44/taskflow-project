// src/index.ts
import { calcularMedia, calcularMediana, filtrarAtipicos } from './math-utils.js';
const datosLaboratorio = [10, 15, 20, 25, 30, 1000]; // El 1000 es el valor atípico
const limite = 100;
console.log("--- RESULTADOS DEL LABORATORIO ---");
// 1. Probar Media
const media = calcularMedia(datosLaboratorio);
console.log(`Media original: ${media}`);
// 2. Probar Mediana
const mediana = calcularMediana(datosLaboratorio);
console.log(`Mediana original: ${mediana}`);
// 3. Probar Filtro y nueva Media
const datosLimpios = filtrarAtipicos(datosLaboratorio, limite);
const mediaLimpia = calcularMedia(datosLimpios);
console.log(`Datos tras filtrar (límite ${limite}): [${datosLimpios}]`);
console.log(`Nueva media (sin atípicos): ${mediaLimpia}`);
// 4. Prueba de seguridad (array vacío)
console.log(`Prueba array vacío: ${calcularMedia([])}`);
