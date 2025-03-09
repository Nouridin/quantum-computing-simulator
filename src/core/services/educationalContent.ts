import { EducationalContent, ExplanationLevel } from '../types';

/**
 * Educational content for quantum computing concepts
 */
export const quantumConcepts: EducationalContent[] = [
  {
    id: 'superposition',
    title: 'Quantum Superposition',
    content: `
      <p>Superposition is a fundamental principle of quantum mechanics that allows quantum systems to exist in multiple states simultaneously.</p>
      <p>In classical computing, a bit can be either 0 or 1. In quantum computing, a qubit can exist in a superposition of both 0 and 1 states at the same time.</p>
      <p>This is mathematically represented as: |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex numbers that represent the probability amplitudes.</p>
      <p>When we measure a qubit in superposition, it collapses to either 0 or 1 with probabilities |α|² and |β|² respectively.</p>
    `,
    level: ExplanationLevel.BEGINNER,
    relatedGates: ['hadamard'],
    relatedConcepts: ['measurement', 'quantum states']
  },
  {
    id: 'entanglement',
    title: 'Quantum Entanglement',
    content: `
      <p>Quantum entanglement is a phenomenon where two or more qubits become correlated in such a way that the quantum state of each qubit cannot be described independently of the others.</p>
      <p>When qubits are entangled, measuring one qubit instantly affects the state of the other, regardless of the distance between them.</p>
      <p>The most common entangled state is the Bell state: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, where measuring one qubit as 0 means the other will also be 0, and measuring one as 1 means the other will also be 1.</p>
      <p>Entanglement is a key resource for quantum computing and enables many quantum algorithms to achieve speedups over classical algorithms.</p>
    `,
    level: ExplanationLevel.BEGINNER,
    relatedGates: ['cnot', 'hadamard'],
    relatedConcepts: ['superposition', 'bell states']
  },
  {
    id: 'quantum-gates',
    title: 'Quantum Gates',
    content: `
      <p>Quantum gates are the building blocks of quantum circuits, similar to logic gates in classical computing.</p>
      <p>Unlike classical gates, quantum gates are reversible and represented by unitary matrices that preserve the norm of the quantum state.</p>
      <p>Common single-qubit gates include:</p>
      <ul>
        <li><strong>X Gate (NOT):</strong> Flips the state of a qubit (|0⟩ → |1⟩ and |1⟩ → |0⟩)</li>
        <li><strong>H Gate (Hadamard):</strong> Creates superposition (|0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2)</li>
        <li><strong>Z Gate:</strong> Adds a phase flip to the |1⟩ state (|0⟩ → |0⟩ and |1⟩ → -|1⟩)</li>
      </ul>
      <p>Multi-qubit gates like CNOT (Controlled-NOT) are essential for creating entanglement between qubits.</p>
    `,
    level: ExplanationLevel.BEGINNER,
    relatedGates: ['pauliX', 'pauliY', 'pauliZ', 'hadamard', 'cnot'],
    relatedConcepts: ['unitary operations', 'quantum circuits']
  },
  {
    id: 'measurement',
    title: 'Quantum Measurement',
    content: `
      <p>Quantum measurement is the process of observing a quantum system, which causes the system to collapse from a superposition of states to a single definite state.</p>
      <p>When we measure a qubit in the state |ψ⟩ = α|0⟩ + β|1⟩, we get outcome 0 with probability |α|² and outcome 1 with probability |β|².</p>
      <p>Measurement is irreversible and fundamentally changes the quantum state, unlike other quantum operations which are reversible.</p>
      <p>The measurement postulate is one of the fundamental principles of quantum mechanics and has profound implications for quantum computing.</p>
    `,
    level: ExplanationLevel.BEGINNER,
    relatedGates: [],
    relatedConcepts: ['superposition', 'wave function collapse']
  },
  {
    id: 'quantum-algorithms',
    title: 'Quantum Algorithms',
    content: `
      <p>Quantum algorithms are procedures that run on quantum computers to solve computational problems, often with advantages over classical algorithms.</p>
      <p>Key quantum algorithms include:</p>
      <ul>
        <li><strong>Grover's Algorithm:</strong> Provides a quadratic speedup for unstructured search problems</li>
        <li><strong>Shor's Algorithm:</strong> Exponentially faster than classical algorithms for integer factorization</li>
        <li><strong>Quantum Fourier Transform:</strong> A quantum version of the discrete Fourier transform that is exponentially faster</li>
        <li><strong>Quantum Phase Estimation:</strong> Estimates the eigenvalues of a unitary operator</li>
      </ul>
      <p>These algorithms leverage quantum phenomena like superposition, entanglement, and interference to achieve computational advantages.</p>
    `,
    level: ExplanationLevel.INTERMEDIATE,
    relatedGates: ['hadamard', 'pauliX', 'cnot'],
    relatedConcepts: ['superposition', 'entanglement', 'quantum speedup']
  }
];

/**
 * Educational content service
 * Provides access to educational content about quantum computing
 */
export class EducationalContentService {
  /**
   * Get all quantum concepts
   */
  getAllConcepts(): EducationalContent[] {
    return quantumConcepts;
  }
  
  /**
   * Get a concept by ID
   */
  getConceptById(id: string): EducationalContent | undefined {
    return quantumConcepts.find(concept => concept.id === id);
  }
  
  /**
   * Get concepts related to a specific gate
   */
  getConceptsByGate(gateName: string): EducationalContent[] {
    return quantumConcepts.filter(concept => 
      concept.relatedGates?.includes(gateName)
    );
  }
  
  /**
   * Get concepts by explanation level
   */
  getConceptsByLevel(level: ExplanationLevel): EducationalContent[] {
    return quantumConcepts.filter(concept => concept.level === level);
  }
  
  /**
   * Get concepts related to another concept
   */
  getRelatedConcepts(conceptId: string): EducationalContent[] {
    const concept = this.getConceptById(conceptId);
    if (!concept || !concept.relatedConcepts) return [];
    
    return quantumConcepts.filter(c => 
      c.id !== conceptId && 
      concept.relatedConcepts?.includes(c.id)
    );
  }
} 