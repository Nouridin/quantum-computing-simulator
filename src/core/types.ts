/**
 * Core types for the quantum computing simulator
 */

/**
 * Represents a complex number used in quantum calculations
 */
export type Complex = {
  real: number;
  imag: number;
};

/**
 * Quantum state representation
 * - qubits: Number of qubits in the system
 * - vector: State vector as a Float64Array with interleaved real and imaginary parts
 * - probabilities: Optional cached probabilities for measurement
 */
export type QuantumState = {
  qubits: number;
  vector: Float64Array; // [real_0, imag_0, real_1, imag_1, ...]
  probabilities?: Float32Array; // Cached for measurement
};

/**
 * Quantum gate representation
 */
export interface QuantumGate {
  name: string;
  qubits: number; // Number of qubits the gate operates on
  matrix: Complex[][];
  symbol: string; // Symbol used in circuit visualization
  description: string; // Educational description
}

/**
 * Circuit operation type
 */
export type CircuitOperation = {
  gate: QuantumGate;
  targets: number[]; // Target qubit indices
  controls?: number[]; // Optional control qubit indices
  params?: number[]; // Optional parameters for parameterized gates
};

/**
 * Full quantum circuit representation
 */
export type QuantumCircuit = {
  id: string;
  numQubits: number;
  operations: CircuitOperation[];
  measurements: {
    qubit: number;
    classical: number;
  }[];
};

/**
 * Measurement result type
 */
export type MeasurementResult = {
  state: string; // Binary string representation of measured state
  probability: number;
  frequency?: number; // For multiple shot measurements
};

/**
 * Simulation result
 */
export type SimulationResult = {
  circuitId: string;
  finalState: QuantumState;
  measurements: Record<string, MeasurementResult>; // key is binary string
  executionTime: number; // in milliseconds
};

/**
 * Educational explanation levels
 */
export enum ExplanationLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

/**
 * Educational component
 */
export type EducationalContent = {
  id: string;
  title: string;
  content: string;
  level: ExplanationLevel;
  relatedGates?: string[]; // Gate names this content explains
  relatedConcepts?: string[]; // Quantum concepts this content explains
}; 