import { QuantumGate, Complex } from '../types';
import { complex, createComplexMatrix } from './complex';

// Helper function to create gate matrices
function createGate(
  name: string,
  matrix: Complex[][],
  symbol: string,
  description: string,
  qubits: number = 1
): QuantumGate {
  return { name, matrix, symbol, description, qubits };
}

// Identity gate (I)
export const identity: QuantumGate = createGate(
  'identity',
  [
    [complex.create(1, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(1, 0)]
  ],
  'I',
  'Identity gate - leaves the qubit state unchanged'
);

// Pauli-X gate (NOT)
export const pauliX: QuantumGate = createGate(
  'pauliX',
  [
    [complex.create(0, 0), complex.create(1, 0)],
    [complex.create(1, 0), complex.create(0, 0)]
  ],
  'X',
  'Pauli-X gate - flips the qubit state (quantum NOT gate)'
);

// Pauli-Y gate
export const pauliY: QuantumGate = createGate(
  'pauliY',
  [
    [complex.create(0, 0), complex.create(0, -1)],
    [complex.create(0, 1), complex.create(0, 0)]
  ],
  'Y',
  'Pauli-Y gate - rotates the qubit state around the Y-axis of the Bloch sphere'
);

// Pauli-Z gate
export const pauliZ: QuantumGate = createGate(
  'pauliZ',
  [
    [complex.create(1, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(-1, 0)]
  ],
  'Z',
  'Pauli-Z gate - flips the phase of the |1⟩ state'
);

// Hadamard gate (H)
export const hadamard: QuantumGate = createGate(
  'hadamard',
  [
    [complex.create(1/Math.sqrt(2), 0), complex.create(1/Math.sqrt(2), 0)],
    [complex.create(1/Math.sqrt(2), 0), complex.create(-1/Math.sqrt(2), 0)]
  ],
  'H',
  'Hadamard gate - creates superposition by rotating the qubit state equally between |0⟩ and |1⟩'
);

// S gate (phase gate)
export const sGate: QuantumGate = createGate(
  'sGate',
  [
    [complex.create(1, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(0, 1)]
  ],
  'S',
  'S gate (phase gate) - rotates the qubit state by 90° around the Z-axis'
);

// T gate
export const tGate: QuantumGate = createGate(
  'tGate',
  [
    [complex.create(1, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(1/Math.sqrt(2), 1/Math.sqrt(2))]
  ],
  'T',
  'T gate - rotates the qubit state by 45° around the Z-axis'
);

// CNOT gate (Controlled-X)
export const cnot: QuantumGate = createGate(
  'cnot',
  [
    [complex.create(1, 0), complex.create(0, 0), complex.create(0, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(1, 0), complex.create(0, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(0, 0), complex.create(0, 0), complex.create(1, 0)],
    [complex.create(0, 0), complex.create(0, 0), complex.create(1, 0), complex.create(0, 0)]
  ],
  'CNOT',
  'Controlled-NOT gate - flips the target qubit if the control qubit is |1⟩',
  2
);

// Toffoli gate (CCNOT - Controlled-Controlled-NOT)
export const toffoli: QuantumGate = createGate(
  'toffoli',
  (() => {
    const matrix = createComplexMatrix(8, 8);
    // Initialize the Toffoli matrix
    for (let i = 0; i < 8; i++) {
      if (i === 6) {
        matrix[i][7] = complex.create(1, 0);
        matrix[i][i] = complex.create(0, 0);
      } else if (i === 7) {
        matrix[i][6] = complex.create(1, 0);
        matrix[i][i] = complex.create(0, 0);
      } else {
        matrix[i][i] = complex.create(1, 0);
      }
    }
    return matrix;
  })(),
  'CCNOT',
  'Toffoli gate (CCNOT) - flips the target qubit if both control qubits are |1⟩',
  3
);

// SWAP gate
export const swap: QuantumGate = createGate(
  'swap',
  [
    [complex.create(1, 0), complex.create(0, 0), complex.create(0, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(0, 0), complex.create(1, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(1, 0), complex.create(0, 0), complex.create(0, 0)],
    [complex.create(0, 0), complex.create(0, 0), complex.create(0, 0), complex.create(1, 0)]
  ],
  'SWAP',
  'SWAP gate - exchanges the state of two qubits',
  2
);

// Collection of all standard gates
export const standardGates: Record<string, QuantumGate> = {
  identity,
  pauliX,
  pauliY,
  pauliZ,
  hadamard,
  sGate,
  tGate,
  cnot,
  toffoli,
  swap
};

/**
 * Create a rotation gate around the X, Y, or Z axis
 */
export function createRotationGate(axis: 'X' | 'Y' | 'Z', theta: number): QuantumGate {
  const cosTheta = Math.cos(theta / 2);
  const sinTheta = Math.sin(theta / 2);
  
  let matrix: Complex[][];
  
  switch (axis) {
    case 'X':
      matrix = [
        [complex.create(cosTheta, 0), complex.create(0, -sinTheta)],
        [complex.create(0, -sinTheta), complex.create(cosTheta, 0)]
      ];
      return createGate(
        `RX(${theta.toFixed(2)})`,
        matrix,
        'RX',
        `Rotation around X-axis by ${theta.toFixed(2)} radians`
      );
    
    case 'Y':
      matrix = [
        [complex.create(cosTheta, 0), complex.create(-sinTheta, 0)],
        [complex.create(sinTheta, 0), complex.create(cosTheta, 0)]
      ];
      return createGate(
        `RY(${theta.toFixed(2)})`,
        matrix,
        'RY',
        `Rotation around Y-axis by ${theta.toFixed(2)} radians`
      );
    
    case 'Z':
      matrix = [
        [complex.create(Math.cos(-theta/2), Math.sin(-theta/2)), complex.create(0, 0)],
        [complex.create(0, 0), complex.create(Math.cos(theta/2), Math.sin(theta/2))]
      ];
      return createGate(
        `RZ(${theta.toFixed(2)})`,
        matrix,
        'RZ',
        `Rotation around Z-axis by ${theta.toFixed(2)} radians`
      );
  }
}

/**
 * Create a phase gate with arbitrary phase
 */
export function createPhaseGate(phi: number): QuantumGate {
  return createGate(
    `P(${phi.toFixed(2)})`,
    [
      [complex.create(1, 0), complex.create(0, 0)],
      [complex.create(0, 0), complex.fromPolar(1, phi)]
    ],
    'P',
    `Phase gate - adds a phase of ${phi.toFixed(2)} radians to the |1⟩ state`
  );
}

/**
 * Create a unitary gate with the given parameters
 */
export function createUGate(theta: number, phi: number, lambda: number): QuantumGate {
  const cosTheta = Math.cos(theta / 2);
  const sinTheta = Math.sin(theta / 2);
  
  return createGate(
    `U(${theta.toFixed(2)},${phi.toFixed(2)},${lambda.toFixed(2)})`,
    [
      [complex.create(cosTheta, 0), complex.scale(complex.fromPolar(1, -lambda), -sinTheta)],
      [complex.scale(complex.fromPolar(1, phi), sinTheta), complex.scale(complex.fromPolar(1, phi + lambda), cosTheta)]
    ],
    'U',
    `Unitary gate with parameters theta=${theta.toFixed(2)}, phi=${phi.toFixed(2)}, lambda=${lambda.toFixed(2)}`
  );
} 