// src/math-utils.ts (Versión Estricta Final)

export const calcularMedia = (array: number[]): number | null => {
  if (!array || array.length === 0) return null;
  const suma = array.reduce((acc: number, curr: number) => acc + curr, 0);
  return suma / array.length;
};

export const calcularMediana = (array: number[]): number | null => {
  if (!array || array.length === 0) return null;
  const sorted = [...array].sort((a, b) => a - b);
  const mitad = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mitad - 1] + sorted[mitad]) / 2;
  }
  return sorted[mitad];
};

export const filtrarAtipicos = (array: number[], limite: number): number[] => {
  if (!array) return [];
  return array.filter((num) => Math.abs(num) <= limite);
};

