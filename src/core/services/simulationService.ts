import { wrap, Remote } from 'comlink';
import { QuantumCircuit, SimulationResult } from '../types';

/**
 * Type for the worker API
 */
interface SimulationWorkerAPI {
  runCircuit(circuit: QuantumCircuit, shots?: number): Promise<SimulationResult>;
  getStateString(result: SimulationResult): Promise<string>;
  getProbabilities(result: SimulationResult): Promise<Float32Array>;
  benchmark(numQubits: number, numGates: number): Promise<{ 
    executionTime: number;
    qubits: number;
    gates: number;
  }>;
}

/**
 * Service for quantum circuit simulation
 * Handles communication with the worker thread
 */
export class SimulationService {
  private worker: Worker;
  private api: Remote<SimulationWorkerAPI>;
  
  constructor() {
    // Create a new worker
    this.worker = new Worker(
      new URL('../../workers/simulationWorker.ts', import.meta.url),
      { type: 'module' }
    );
    
    // Wrap the worker with Comlink
    this.api = wrap<SimulationWorkerAPI>(this.worker);
  }
  
  /**
   * Run a quantum circuit simulation
   */
  async runCircuit(circuit: QuantumCircuit, shots: number = 1024): Promise<SimulationResult> {
    try {
      return await this.api.runCircuit(circuit, shots);
    } catch (error) {
      console.error('Error running quantum circuit:', error);
      throw error;
    }
  }
  
  /**
   * Get a human-readable representation of a quantum state
   */
  async getStateString(result: SimulationResult): Promise<string> {
    return await this.api.getStateString(result);
  }
  
  /**
   * Get the probability of measuring each basis state
   */
  async getProbabilities(result: SimulationResult): Promise<Float32Array> {
    return await this.api.getProbabilities(result);
  }
  
  /**
   * Benchmark the simulator with a circuit of the given size
   */
  async benchmark(numQubits: number, numGates: number): Promise<{ 
    executionTime: number;
    qubits: number;
    gates: number;
  }> {
    return await this.api.benchmark(numQubits, numGates);
  }
  
  /**
   * Terminate the worker
   */
  terminate(): void {
    this.worker.terminate();
  }
} 