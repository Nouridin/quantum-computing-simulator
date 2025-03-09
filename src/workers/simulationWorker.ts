import { expose } from 'comlink';
import { CircuitSimulator } from '../core/engine/circuitSimulator';
import { QuantumCircuit, SimulationResult } from '../core/types';

/**
 * Simulation Worker API
 * Exposes quantum simulation functionality to the main thread
 */
class SimulationWorkerAPI {
  private simulator: CircuitSimulator;
  
  constructor() {
    this.simulator = new CircuitSimulator();
    console.log('Quantum simulation worker initialized');
  }
  
  /**
   * Run a quantum circuit simulation
   */
  runCircuit(circuit: QuantumCircuit, shots: number = 1024): SimulationResult {
    try {
      return this.simulator.runCircuit(circuit, shots);
    } catch (error) {
      console.error('Error in quantum simulation:', error);
      throw error;
    }
  }
  
  /**
   * Get a human-readable representation of a quantum state
   */
  getStateString(result: SimulationResult): string {
    return this.simulator.getStateString(result);
  }
  
  /**
   * Get the probability of measuring each basis state
   */
  getProbabilities(result: SimulationResult): Float32Array {
    return this.simulator.getProbabilities(result);
  }
  
  /**
   * Benchmark the simulator with a circuit of the given size
   */
  benchmark(numQubits: number, numGates: number): { executionTime: number, qubits: number, gates: number } {
    const startTime = performance.now();
    
    // Create a test circuit with Hadamard gates on all qubits
    const circuit: QuantumCircuit = {
      id: `benchmark-${numQubits}-${numGates}`,
      numQubits,
      operations: [],
      measurements: []
    };
    
    // Add Hadamard gates to create superposition
    for (let i = 0; i < numQubits; i++) {
      circuit.operations.push({
        gate: {
          name: 'hadamard',
          qubits: 1,
          matrix: [
            [{ real: 1/Math.sqrt(2), imag: 0 }, { real: 1/Math.sqrt(2), imag: 0 }],
            [{ real: 1/Math.sqrt(2), imag: 0 }, { real: -1/Math.sqrt(2), imag: 0 }]
          ],
          symbol: 'H',
          description: 'Hadamard gate'
        },
        targets: [i]
      });
    }
    
    // Add some CNOT gates
    const remainingGates = numGates - numQubits;
    for (let i = 0; i < remainingGates && i < numQubits - 1; i++) {
      circuit.operations.push({
        gate: {
          name: 'cnot',
          qubits: 2,
          matrix: [
            [{ real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
            [{ real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }],
            [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }],
            [{ real: 0, imag: 0 }, { real: 0, imag: 0 }, { real: 1, imag: 0 }, { real: 0, imag: 0 }]
          ],
          symbol: 'CNOT',
          description: 'CNOT gate'
        },
        targets: [i + 1],
        controls: [i]
      });
    }
    
    // Run the circuit
    this.simulator.runCircuit(circuit, 0);
    
    const endTime = performance.now();
    
    return {
      executionTime: endTime - startTime,
      qubits: numQubits,
      gates: circuit.operations.length
    };
  }
}

// Expose the API to the main thread using Comlink
expose(new SimulationWorkerAPI()); 