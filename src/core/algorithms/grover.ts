import { QuantumCircuit, CircuitOperation } from '../types';
import { standardGates } from '../math/gates';
import { createRotationGate } from '../math/gates';

/**
 * Grover's Algorithm Implementation
 * 
 * Grover's algorithm is a quantum algorithm for unstructured search that provides
 * a quadratic speedup compared to classical algorithms.
 */
export class GroverAlgorithm {
  /**
   * Create a Grover's algorithm circuit for searching a marked item
   * 
   * @param numQubits Number of qubits (excluding ancilla)
   * @param markedItem The item to search for (as a binary string)
   * @param iterations Number of Grover iterations (optimal is approximately π/4 * sqrt(N))
   */
  createCircuit(numQubits: number, markedItem: string, iterations: number = 1): QuantumCircuit {
    // Validate inputs
    if (numQubits <= 0) {
      throw new Error('Number of qubits must be positive');
    }
    
    if (markedItem.length !== numQubits) {
      throw new Error(`Marked item must be a binary string of length ${numQubits}`);
    }
    
    if (!/^[01]+$/.test(markedItem)) {
      throw new Error('Marked item must be a binary string (0s and 1s only)');
    }
    
    // Create circuit
    const circuit: QuantumCircuit = {
      id: `grover-${numQubits}-${markedItem}-${iterations}`,
      numQubits: numQubits + 1, // +1 for ancilla qubit
      operations: [],
      measurements: []
    };
    
    // Initialize all qubits to |0⟩
    // Apply Hadamard to all qubits except the ancilla
    for (let i = 0; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.hadamard,
        targets: [i]
      });
    }
    
    // Initialize ancilla qubit to |1⟩ and then apply Hadamard
    circuit.operations.push({
      gate: standardGates.pauliX,
      targets: [numQubits]
    });
    
    circuit.operations.push({
      gate: standardGates.hadamard,
      targets: [numQubits]
    });
    
    // Apply Grover iterations
    for (let iter = 0; iter < iterations; iter++) {
      // Oracle (marks the solution)
      this.applyOracle(circuit, numQubits, markedItem);
      
      // Diffusion operator (amplification)
      this.applyDiffusion(circuit, numQubits);
    }
    
    // Measure all qubits except the ancilla
    for (let i = 0; i < numQubits; i++) {
      circuit.measurements.push({
        qubit: i,
        classical: i
      });
    }
    
    return circuit;
  }
  
  /**
   * Apply the oracle that marks the solution
   */
  private applyOracle(circuit: QuantumCircuit, numQubits: number, markedItem: string): void {
    // For each qubit that should be 0 in the marked item, apply X gate before and after
    // This converts the problem to marking the |11...1⟩ state
    const flipMask: number[] = [];
    
    for (let i = 0; i < markedItem.length; i++) {
      if (markedItem[i] === '0') {
        flipMask.push(i);
        circuit.operations.push({
          gate: standardGates.pauliX,
          targets: [i]
        });
      }
    }
    
    // Apply multi-controlled Z gate
    // For simplicity, we'll implement it as a series of CNOTs and a Z gate
    
    // First CNOT from control qubit 0 to ancilla
    circuit.operations.push({
      gate: standardGates.cnot,
      targets: [numQubits],
      controls: [0]
    });
    
    // CNOTs from other control qubits to ancilla
    for (let i = 1; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.cnot,
        targets: [numQubits],
        controls: [i]
      });
    }
    
    // Apply Z gate to ancilla
    circuit.operations.push({
      gate: standardGates.pauliZ,
      targets: [numQubits]
    });
    
    // Reverse the CNOTs
    for (let i = numQubits - 1; i >= 0; i--) {
      circuit.operations.push({
        gate: standardGates.cnot,
        targets: [numQubits],
        controls: [i]
      });
    }
    
    // Flip back the qubits that were flipped
    for (const i of flipMask) {
      circuit.operations.push({
        gate: standardGates.pauliX,
        targets: [i]
      });
    }
  }
  
  /**
   * Apply the diffusion operator (amplitude amplification)
   */
  private applyDiffusion(circuit: QuantumCircuit, numQubits: number): void {
    // Apply Hadamard to all qubits
    for (let i = 0; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.hadamard,
        targets: [i]
      });
    }
    
    // Apply X to all qubits
    for (let i = 0; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.pauliX,
        targets: [i]
      });
    }
    
    // Apply multi-controlled Z gate (similar to oracle implementation)
    // First CNOT from control qubit 0 to ancilla
    circuit.operations.push({
      gate: standardGates.cnot,
      targets: [numQubits],
      controls: [0]
    });
    
    // CNOTs from other control qubits to ancilla
    for (let i = 1; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.cnot,
        targets: [numQubits],
        controls: [i]
      });
    }
    
    // Apply Z gate to ancilla
    circuit.operations.push({
      gate: standardGates.pauliZ,
      targets: [numQubits]
    });
    
    // Reverse the CNOTs
    for (let i = numQubits - 1; i >= 0; i--) {
      circuit.operations.push({
        gate: standardGates.cnot,
        targets: [numQubits],
        controls: [i]
      });
    }
    
    // Apply X to all qubits
    for (let i = 0; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.pauliX,
        targets: [i]
      });
    }
    
    // Apply Hadamard to all qubits
    for (let i = 0; i < numQubits; i++) {
      circuit.operations.push({
        gate: standardGates.hadamard,
        targets: [i]
      });
    }
  }
  
  /**
   * Calculate the optimal number of iterations for Grover's algorithm
   */
  calculateOptimalIterations(numQubits: number): number {
    const N = Math.pow(2, numQubits);
    return Math.floor(Math.PI / 4 * Math.sqrt(N));
  }
} 