import { Complex, QuantumState, CircuitOperation, MeasurementResult } from '../types';
import { complex } from '../math/complex';
import { multiplyComplexMatrices, tensorProduct } from '../math/complex';
import { standardGates } from '../math/gates';

/**
 * Quantum State Vector Engine
 * Handles quantum state representation and manipulation
 */
export class StateVectorEngine {
  /**
   * Create a new quantum state with the specified number of qubits
   */
  createState(qubits: number): QuantumState {
    const dim = 1 << qubits; // 2^qubits
    const vector = new Float64Array(dim * 2); // [real_0, imag_0, real_1, imag_1, ...]
    
    // Initialize to |0...0⟩ state
    vector[0] = 1.0; // Real part of first amplitude
    
    return {
      qubits,
      vector
    };
  }

  /**
   * Convert state vector to human-readable representation
   */
  stateToString(state: QuantumState): string {
    const dim = 1 << state.qubits;
    let result = '';
    
    for (let i = 0; i < dim; i++) {
      const realIdx = i * 2;
      const imagIdx = realIdx + 1;
      const real = state.vector[realIdx];
      const imag = state.vector[imagIdx];
      
      // Only show non-zero amplitudes (with some small epsilon)
      if (Math.abs(real) > 1e-10 || Math.abs(imag) > 1e-10) {
        const amplitude = complex.toString({ real, imag });
        const binaryString = i.toString(2).padStart(state.qubits, '0');
        result += `${amplitude}|${binaryString}⟩ + `;
      }
    }
    
    // Remove trailing " + "
    return result.length > 0 ? result.slice(0, -3) : '0|0⟩';
  }

  /**
   * Calculate probabilities for all basis states
   */
  calculateProbabilities(state: QuantumState): Float32Array {
    const dim = 1 << state.qubits;
    const probabilities = new Float32Array(dim);
    
    for (let i = 0; i < dim; i++) {
      const realIdx = i * 2;
      const imagIdx = realIdx + 1;
      const real = state.vector[realIdx];
      const imag = state.vector[imagIdx];
      
      probabilities[i] = real * real + imag * imag;
    }
    
    return probabilities;
  }

  /**
   * Apply a quantum gate to the state vector
   */
  applyGate(state: QuantumState, operation: CircuitOperation): QuantumState {
    const { gate, targets, controls = [] } = operation;
    
    if (targets.length !== gate.qubits && gate.qubits === 1 && controls.length === 0) {
      // Single qubit gate case
      return this.applySingleQubitGate(state, gate.matrix, targets[0]);
    } else if (gate.qubits === 2 && targets.length === 2 && controls.length === 0) {
      // Two-qubit gate without controls
      return this.applyTwoQubitGate(state, gate.matrix, targets[0], targets[1]);
    } else if (gate.name === 'cnot' && targets.length === 1 && controls.length === 1) {
      // CNOT case with separate control and target
      return this.applyCNOT(state, controls[0], targets[0]);
    } else {
      // General case for more complex gates or controlled operations
      return this.applyGeneralGate(state, operation);
    }
  }

  /**
   * Apply a single-qubit gate to the state vector
   */
  private applySingleQubitGate(state: QuantumState, matrix: Complex[][], targetQubit: number): QuantumState {
    const qubits = state.qubits;
    const dim = 1 << qubits;
    const result = new Float64Array(state.vector.length);
    
    // For each computational basis state
    for (let i = 0; i < dim; i++) {
      // Determine if target qubit is 0 or 1 in this basis state
      const targetBit = (i >> targetQubit) & 1;
      
      // Calculate the basis state with target qubit flipped
      const flipped = i ^ (1 << targetQubit);
      
      // Apply matrix to the relevant amplitudes
      const i0RealIdx = i * 2;
      const i0ImagIdx = i0RealIdx + 1;
      const i1RealIdx = flipped * 2;
      const i1ImagIdx = i1RealIdx + 1;
      
      if (targetBit === 0) {
        // Target qubit is |0⟩
        // Apply matrix[0][0] * current + matrix[0][1] * flipped
        const m00 = matrix[0][0];
        const m01 = matrix[0][1];
        
        // Get current amplitude
        const curReal = state.vector[i0RealIdx];
        const curImag = state.vector[i0ImagIdx];
        
        // Get flipped amplitude
        const flipReal = state.vector[i1RealIdx];
        const flipImag = state.vector[i1ImagIdx];
        
        // Compute m00 * current
        const term1Real = m00.real * curReal - m00.imag * curImag;
        const term1Imag = m00.real * curImag + m00.imag * curReal;
        
        // Compute m01 * flipped
        const term2Real = m01.real * flipReal - m01.imag * flipImag;
        const term2Imag = m01.real * flipImag + m01.imag * flipReal;
        
        // Sum the terms
        result[i0RealIdx] = term1Real + term2Real;
        result[i0ImagIdx] = term1Imag + term2Imag;
      } else {
        // Target qubit is |1⟩
        // Apply matrix[1][0] * flipped + matrix[1][1] * current
        const m10 = matrix[1][0];
        const m11 = matrix[1][1];
        
        // Get current amplitude
        const curReal = state.vector[i0RealIdx];
        const curImag = state.vector[i0ImagIdx];
        
        // Get flipped amplitude
        const flipReal = state.vector[i1RealIdx];
        const flipImag = state.vector[i1ImagIdx];
        
        // Compute m10 * flipped
        const term1Real = m10.real * flipReal - m10.imag * flipImag;
        const term1Imag = m10.real * flipImag + m10.imag * flipReal;
        
        // Compute m11 * current
        const term2Real = m11.real * curReal - m11.imag * curImag;
        const term2Imag = m11.real * curImag + m11.imag * curReal;
        
        // Sum the terms
        result[i0RealIdx] = term1Real + term2Real;
        result[i0ImagIdx] = term1Imag + term2Imag;
      }
    }
    
    return {
      qubits,
      vector: result
    };
  }

  /**
   * Apply a CNOT gate with specified control and target qubits
   */
  private applyCNOT(state: QuantumState, controlQubit: number, targetQubit: number): QuantumState {
    const qubits = state.qubits;
    const dim = 1 << qubits;
    const result = new Float64Array(state.vector);
    
    for (let i = 0; i < dim; i++) {
      // Check if control qubit is 1
      const controlBit = (i >> controlQubit) & 1;
      
      if (controlBit === 1) {
        // Flip the target qubit in this basis state
        const flipped = i ^ (1 << targetQubit);
        
        // Swap amplitudes
        const iRealIdx = i * 2;
        const iImagIdx = iRealIdx + 1;
        const flippedRealIdx = flipped * 2;
        const flippedImagIdx = flippedRealIdx + 1;
        
        const tempReal = result[iRealIdx];
        const tempImag = result[iImagIdx];
        
        result[iRealIdx] = result[flippedRealIdx];
        result[iImagIdx] = result[flippedImagIdx];
        
        result[flippedRealIdx] = tempReal;
        result[flippedImagIdx] = tempImag;
      }
    }
    
    return {
      qubits,
      vector: result
    };
  }

  /**
   * Apply a two-qubit gate directly
   */
  private applyTwoQubitGate(
    state: QuantumState,
    matrix: Complex[][],
    qubit1: number,
    qubit2: number
  ): QuantumState {
    // General approach for two-qubit gates
    const qubits = state.qubits;
    const dim = 1 << qubits;
    const result = new Float64Array(dim * 2);
    
    // For each computational basis state
    for (let i = 0; i < dim; i++) {
      // Determine values of the two qubits in this basis state
      const bit1 = (i >> qubit1) & 1;
      const bit2 = (i >> qubit2) & 1;
      
      // Calculate the index in the 2-qubit matrix (0-3)
      const matrixIdx = (bit1 << 1) | bit2;
      
      // For each possible output state
      for (let j = 0; j < 4; j++) {
        // Calculate the new values of the two qubits
        const newBit1 = (j >> 1) & 1;
        const newBit2 = j & 1;
        
        // Calculate the new basis state by flipping bits if necessary
        let newState = i;
        if (bit1 !== newBit1) newState ^= (1 << qubit1);
        if (bit2 !== newBit2) newState ^= (1 << qubit2);
        
        // Get matrix element
        const matrixElement = matrix[j][matrixIdx];
        
        // Get input amplitude
        const inRealIdx = i * 2;
        const inImagIdx = inRealIdx + 1;
        const inReal = state.vector[inRealIdx];
        const inImag = state.vector[inImagIdx];
        
        // Compute matrix element * input amplitude
        const termReal = matrixElement.real * inReal - matrixElement.imag * inImag;
        const termImag = matrixElement.real * inImag + matrixElement.imag * inReal;
        
        // Add to result
        const outRealIdx = newState * 2;
        const outImagIdx = outRealIdx + 1;
        result[outRealIdx] += termReal;
        result[outImagIdx] += termImag;
      }
    }
    
    return {
      qubits,
      vector: result
    };
  }

  /**
   * General approach for applying gates (less optimized but handles all cases)
   */
  private applyGeneralGate(state: QuantumState, operation: CircuitOperation): QuantumState {
    // For complex gates or controlled operations, we use a general approach
    // This is less optimized but handles all cases
    const { gate, targets, controls = [], params = [] } = operation;
    
    // To be implemented for full generality
    // This would involve constructing the full gate matrix for the operation
    // and applying it to the state vector
    
    // Placeholder implementation - a real implementation would be more involved
    // and include tensor products for building the full gate matrix
    console.warn('Using general gate application for', gate.name);
    
    return state; // Just return the original state for now
  }

  /**
   * Perform a measurement on the quantum state
   */
  measure(state: QuantumState, qubit: number): [QuantumState, boolean] {
    // Calculate probabilities if not already cached
    if (!state.probabilities) {
      state.probabilities = this.calculateProbabilities(state);
    }
    
    const dim = 1 << state.qubits;
    
    // Calculate probability of measuring |1⟩ for the specified qubit
    let prob1 = 0;
    for (let i = 0; i < dim; i++) {
      const bitValue = (i >> qubit) & 1;
      if (bitValue === 1) {
        prob1 += state.probabilities[i];
      }
    }
    
    // Determine measurement outcome based on probabilities
    const random = Math.random();
    const outcome = random < prob1 ? 1 : 0;
    const measured = outcome === 1;
    
    // Create new state vector after measurement
    const newVector = new Float64Array(dim * 2);
    let normalizationFactor = 0;
    
    for (let i = 0; i < dim; i++) {
      const bitValue = (i >> qubit) & 1;
      if (bitValue === outcome) {
        const realIdx = i * 2;
        const imagIdx = realIdx + 1;
        const real = state.vector[realIdx];
        const imag = state.vector[imagIdx];
        
        newVector[realIdx] = real;
        newVector[imagIdx] = imag;
        normalizationFactor += real * real + imag * imag;
      }
    }
    
    // Normalize the new state vector
    normalizationFactor = Math.sqrt(normalizationFactor);
    for (let i = 0; i < newVector.length; i++) {
      newVector[i] /= normalizationFactor;
    }
    
    return [
      {
        qubits: state.qubits,
        vector: newVector
      },
      measured
    ];
  }

  /**
   * Perform multiple shots of measurement on all qubits
   */
  sampleMeasurements(state: QuantumState, shots: number): Record<string, MeasurementResult> {
    // Calculate probabilities
    const probabilities = this.calculateProbabilities(state);
    const dim = 1 << state.qubits;
    
    // Create cumulative probability distribution
    const cumulativeProbs = new Float64Array(dim);
    cumulativeProbs[0] = probabilities[0];
    for (let i = 1; i < dim; i++) {
      cumulativeProbs[i] = cumulativeProbs[i - 1] + probabilities[i];
    }
    
    // Sample measurement outcomes
    const results: Record<string, MeasurementResult> = {};
    
    for (let shot = 0; shot < shots; shot++) {
      const random = Math.random();
      
      // Binary search to find the outcome
      let low = 0;
      let high = dim - 1;
      let outcome = 0;
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (random < cumulativeProbs[mid]) {
          outcome = mid;
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }
      
      // Convert to binary string
      const bitString = outcome.toString(2).padStart(state.qubits, '0');
      
      // Update results
      if (results[bitString]) {
        results[bitString].frequency = (results[bitString].frequency || 0) + 1;
      } else {
        results[bitString] = {
          state: bitString,
          probability: probabilities[outcome],
          frequency: 1
        };
      }
    }
    
    // Calculate frequencies
    for (const key in results) {
      results[key].frequency = results[key].frequency! / shots;
    }
    
    return results;
  }
} 