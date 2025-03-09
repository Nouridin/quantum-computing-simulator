import { QuantumCircuit, SimulationResult, MeasurementResult } from '../types';
import { StateVectorEngine } from './stateVector';

/**
 * Quantum Circuit Simulator
 * Executes quantum circuits using the state vector engine
 */
export class CircuitSimulator {
  private stateEngine: StateVectorEngine;
  
  constructor() {
    this.stateEngine = new StateVectorEngine();
  }
  
  /**
   * Run a quantum circuit and return the simulation results
   */
  runCircuit(circuit: QuantumCircuit, shots: number = 1024): SimulationResult {
    const startTime = performance.now();
    
    // Initialize quantum state
    let state = this.stateEngine.createState(circuit.numQubits);
    
    // Apply operations in order
    for (const operation of circuit.operations) {
      state = this.stateEngine.applyGate(state, operation);
    }
    
    // Calculate final state probabilities
    let measurements: Record<string, MeasurementResult> = {};
    
    if (shots === 0) {
      // Just return the final state without measurements
    } else if (shots === 1) {
      // Perform single-shot measurements on specified qubits
      const classical = new Array(circuit.measurements.length).fill(0);
      
      for (const { qubit, classical: classicalIndex } of circuit.measurements) {
        // Measure each qubit
        const [newState, result] = this.stateEngine.measure(state, qubit);
        state = newState;
        classical[classicalIndex] = result ? 1 : 0;
      }
      
      // Convert classical bits to string
      const bitString = classical.join('');
      measurements[bitString] = {
        state: bitString,
        probability: 1.0,
        frequency: 1.0
      };
    } else {
      // Perform multi-shot measurements 
      measurements = this.stateEngine.sampleMeasurements(state, shots);
    }
    
    const endTime = performance.now();
    
    return {
      circuitId: circuit.id,
      finalState: state,
      measurements,
      executionTime: endTime - startTime
    };
  }
  
  /**
   * Get a human-readable representation of a quantum state
   */
  getStateString(result: SimulationResult): string {
    return this.stateEngine.stateToString(result.finalState);
  }
  
  /**
   * Get the probability of measuring each basis state
   */
  getProbabilities(result: SimulationResult): Float32Array {
    return this.stateEngine.calculateProbabilities(result.finalState);
  }
} 