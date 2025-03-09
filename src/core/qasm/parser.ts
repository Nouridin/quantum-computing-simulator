import { QuantumCircuit, CircuitOperation } from '../types';
import { standardGates } from '../math/gates';

/**
 * Simple QASM Parser
 * Parses OpenQASM 2.0 code into a quantum circuit
 * 
 * Note: This is a simplified parser that handles basic QASM syntax.
 * A full implementation would use a proper lexer/parser like ANTLR.
 */
export class QASMParser {
  /**
   * Parse QASM code into a quantum circuit
   */
  parseQASM(qasmCode: string): QuantumCircuit {
    // Remove comments
    const cleanCode = qasmCode.replace(/\/\/.*$/gm, '');
    
    // Split into lines and remove empty lines
    const lines = cleanCode.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Initialize circuit
    const circuit: QuantumCircuit = {
      id: 'qasm-circuit-' + Date.now(),
      numQubits: 0,
      operations: [],
      measurements: []
    };
    
    // Process each line
    for (const line of lines) {
      // Check for QASM version
      if (line.startsWith('OPENQASM')) {
        // Just check version
        if (!line.includes('2.0')) {
          throw new Error('Only OpenQASM 2.0 is supported');
        }
        continue;
      }
      
      // Check for include statements
      if (line.startsWith('include')) {
        // Skip include statements for now
        continue;
      }
      
      // Check for qubit declarations
      if (line.startsWith('qreg')) {
        const match = line.match(/qreg\s+(\w+)\[(\d+)\];/);
        if (match) {
          const numQubits = parseInt(match[2], 10);
          circuit.numQubits = numQubits;
        }
        continue;
      }
      
      // Check for classical register declarations
      if (line.startsWith('creg')) {
        // Skip for now, we'll handle classical registers later
        continue;
      }
      
      // Check for gate applications
      if (this.isGateApplication(line)) {
        const operation = this.parseGateApplication(line, circuit.numQubits);
        if (operation) {
          circuit.operations.push(operation);
        }
        continue;
      }
      
      // Check for measurement operations
      if (line.startsWith('measure')) {
        const match = line.match(/measure\s+(\w+)\[(\d+)\]\s*->\s*(\w+)\[(\d+)\];/);
        if (match) {
          const qubit = parseInt(match[2], 10);
          const classical = parseInt(match[4], 10);
          circuit.measurements.push({ qubit, classical });
        }
        continue;
      }
    }
    
    return circuit;
  }
  
  /**
   * Check if a line is a gate application
   */
  private isGateApplication(line: string): boolean {
    // Check for common gate names
    const gateNames = Object.keys(standardGates);
    return gateNames.some(name => 
      line.startsWith(name) || 
      line.startsWith(name.toLowerCase())
    );
  }
  
  /**
   * Parse a gate application line
   */
  private parseGateApplication(line: string, numQubits: number): CircuitOperation | null {
    // Extract gate name and parameters
    const gateMatch = line.match(/^(\w+)(?:\((.*?)\))?\s+(.*?);/);
    if (!gateMatch) return null;
    
    const [_, gateName, paramsStr, qubitsStr] = gateMatch;
    
    // Find the gate in standard gates
    const gate = Object.values(standardGates).find(g => 
      g.name.toLowerCase() === gateName.toLowerCase()
    );
    
    if (!gate) {
      console.warn(`Unknown gate: ${gateName}`);
      return null;
    }
    
    // Parse parameters if any
    const params: number[] = [];
    if (paramsStr) {
      params.push(...paramsStr.split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => this.evaluateExpression(p)));
    }
    
    // Parse qubit indices
    const qubitIndices = qubitsStr.split(',')
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .map(q => {
        const match = q.match(/(\w+)\[(\d+)\]/);
        return match ? parseInt(match[2], 10) : -1;
      })
      .filter(idx => idx >= 0 && idx < numQubits);
    
    // For controlled gates, separate control and target qubits
    let targets: number[] = [];
    let controls: number[] = [];
    
    if (gateName.toLowerCase() === 'cx' || gateName.toLowerCase() === 'cnot') {
      // CNOT gate: first qubit is control, second is target
      if (qubitIndices.length >= 2) {
        controls = [qubitIndices[0]];
        targets = [qubitIndices[1]];
      }
    } else if (gateName.toLowerCase() === 'ccx' || gateName.toLowerCase() === 'toffoli') {
      // Toffoli gate: first two qubits are controls, third is target
      if (qubitIndices.length >= 3) {
        controls = [qubitIndices[0], qubitIndices[1]];
        targets = [qubitIndices[2]];
      }
    } else {
      // Regular gate: all qubits are targets
      targets = qubitIndices;
    }
    
    return {
      gate,
      targets,
      controls: controls.length > 0 ? controls : undefined,
      params: params.length > 0 ? params : undefined
    };
  }
  
  /**
   * Evaluate a simple mathematical expression
   */
  private evaluateExpression(expr: string): number {
    // Handle common constants
    if (expr === 'pi' || expr === 'PI') return Math.PI;
    
    // Handle simple expressions
    try {
      // This is a simplified approach - a real parser would use a proper expression evaluator
      // eslint-disable-next-line no-eval
      return eval(expr.replace(/pi/g, 'Math.PI'));
    } catch (error) {
      console.error('Error evaluating expression:', expr, error);
      return 0;
    }
  }
  
  /**
   * Generate QASM code from a quantum circuit
   */
  generateQASM(circuit: QuantumCircuit): string {
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
    
    // Declare quantum register
    qasm += `qreg q[${circuit.numQubits}];\n`;
    
    // Declare classical register if there are measurements
    if (circuit.measurements.length > 0) {
      const maxClassical = Math.max(...circuit.measurements.map(m => m.classical)) + 1;
      qasm += `creg c[${maxClassical}];\n`;
    }
    
    qasm += '\n';
    
    // Add operations
    for (const op of circuit.operations) {
      const { gate, targets, controls, params } = op;
      
      // Gate name
      let line = gate.name.toLowerCase();
      
      // Add parameters if any
      if (params && params.length > 0) {
        line += `(${params.join(', ')})`;
      }
      
      // Add control qubits if any
      if (controls && controls.length > 0) {
        for (const control of controls) {
          line += ` q[${control}],`;
        }
      }
      
      // Add target qubits
      for (let i = 0; i < targets.length; i++) {
        line += ` q[${targets[i]}]`;
        if (i < targets.length - 1) {
          line += ',';
        }
      }
      
      qasm += line + ';\n';
    }
    
    // Add measurements
    for (const { qubit, classical } of circuit.measurements) {
      qasm += `measure q[${qubit}] -> c[${classical}];\n`;
    }
    
    return qasm;
  }
} 