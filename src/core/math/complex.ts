import { Complex } from '../types';
import { create, all } from 'mathjs';

// Configure mathjs
const math = create(all);

/**
 * Complex number operations for quantum computing
 */
export const complex = {
  /**
   * Create a new complex number
   */
  create: (real: number, imag: number = 0): Complex => ({ real, imag }),

  /**
   * Add two complex numbers
   */
  add: (a: Complex, b: Complex): Complex => ({
    real: a.real + b.real,
    imag: a.imag + b.imag
  }),

  /**
   * Subtract complex numbers
   */
  subtract: (a: Complex, b: Complex): Complex => ({
    real: a.real - b.real,
    imag: a.imag - b.imag
  }),

  /**
   * Multiply complex numbers
   */
  multiply: (a: Complex, b: Complex): Complex => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  }),

  /**
   * Scale a complex number by a scalar
   */
  scale: (a: Complex, scalar: number): Complex => ({
    real: a.real * scalar,
    imag: a.imag * scalar
  }),

  /**
   * Compute the complex conjugate
   */
  conjugate: (a: Complex): Complex => ({
    real: a.real,
    imag: -a.imag
  }),

  /**
   * Compute the magnitude squared of a complex number
   */
  magSquared: (a: Complex): number => a.real * a.real + a.imag * a.imag,

  /**
   * Compute the magnitude of a complex number
   */
  magnitude: (a: Complex): number => Math.sqrt(complex.magSquared(a)),

  /**
   * Exponential function for complex numbers
   */
  exp: (a: Complex): Complex => {
    const expReal = Math.exp(a.real);
    return {
      real: expReal * Math.cos(a.imag),
      imag: expReal * Math.sin(a.imag)
    };
  },

  /**
   * Create a complex number from polar coordinates
   */
  fromPolar: (r: number, theta: number): Complex => ({
    real: r * Math.cos(theta),
    imag: r * Math.sin(theta)
  }),

  /**
   * Convert complex number to string representation
   */
  toString: (a: Complex): string => {
    if (a.imag === 0) return a.real.toString();
    if (a.real === 0) return `${a.imag}i`;
    const sign = a.imag < 0 ? '-' : '+';
    return `${a.real} ${sign} ${Math.abs(a.imag)}i`;
  }
};

/**
 * Create a matrix of complex numbers
 */
export function createComplexMatrix(rows: number, cols: number): Complex[][] {
  const matrix: Complex[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = complex.create(0, 0);
    }
  }
  return matrix;
}

/**
 * Multiply two complex matrices
 */
export function multiplyComplexMatrices(a: Complex[][], b: Complex[][]): Complex[][] {
  const rowsA = a.length;
  const colsA = a[0].length;
  const rowsB = b.length;
  const colsB = b[0].length;

  if (colsA !== rowsB) {
    throw new Error('Matrix dimensions incompatible for multiplication');
  }

  const result = createComplexMatrix(rowsA, colsB);

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        const product = complex.multiply(a[i][k], b[k][j]);
        result[i][j] = complex.add(result[i][j], product);
      }
    }
  }

  return result;
}

/**
 * Compute tensor product of two complex matrices
 */
export function tensorProduct(a: Complex[][], b: Complex[][]): Complex[][] {
  const rowsA = a.length;
  const colsA = a[0].length;
  const rowsB = b.length;
  const colsB = b[0].length;
  
  const rows = rowsA * rowsB;
  const cols = colsA * colsB;
  
  const result = createComplexMatrix(rows, cols);
  
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      for (let k = 0; k < rowsB; k++) {
        for (let l = 0; l < colsB; l++) {
          result[i * rowsB + k][j * colsB + l] = complex.multiply(a[i][j], b[k][l]);
        }
      }
    }
  }
  
  return result;
} 