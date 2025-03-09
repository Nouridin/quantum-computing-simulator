import { useState, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { CircuitCanvas } from './components/circuit/CircuitCanvas';
import { GatePalette } from './components/circuit/GatePalette';
import { StateVisualizer } from './components/visualization/StateVisualizer';
import { QuantumConcept } from './components/educational/QuantumConcept';
import { SimulationService } from './core/services/simulationService';
import { EducationalContentService, quantumConcepts } from './core/services/educationalContent';
import { GroverAlgorithm } from './core/algorithms/grover';
import { QuantumCircuit, QuantumGate, SimulationResult, QuantumState } from './core/types';
import { standardGates } from './core/math/gates';
import './App.css';

// Create atoms for global state
const circuitAtom = atom<QuantumCircuit>({
  id: 'default-circuit',
  numQubits: 3,
  operations: [],
  measurements: []
});

const simulationResultAtom = atom<SimulationResult | null>(null);

function App() {
  // State
  const [circuit, setCircuit] = useAtom(circuitAtom);
  const [simulationResult, setSimulationResult] = useAtom(simulationResultAtom);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'circuit' | 'qasm' | 'algorithms'>('circuit');
  const [qasmCode, setQasmCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Services
  const [simulationService] = useState(() => new SimulationService());
  const [educationalService] = useState(() => new EducationalContentService());
  
  // Initialize circuit with some gates
  useEffect(() => {
    const initialCircuit: QuantumCircuit = {
      id: 'default-circuit',
      numQubits: 3,
      operations: [
        {
          gate: standardGates.hadamard,
          targets: [0]
        },
        {
          gate: standardGates.cnot,
          targets: [1],
          controls: [0]
        },
        {
          gate: standardGates.pauliX,
          targets: [2]
        }
      ],
      measurements: [
        { qubit: 0, classical: 0 },
        { qubit: 1, classical: 1 },
        { qubit: 2, classical: 2 }
      ]
    };
    
    setCircuit(initialCircuit);
  }, [setCircuit]);
  
  // Handle gate selection
  const handleGateSelect = (gate: QuantumGate) => {
    // In a real app, we would add the gate to the circuit at the selected position
    // For now, we'll just add it to the end of the circuit on qubit 0
    const newCircuit = { ...circuit };
    newCircuit.operations.push({
      gate,
      targets: [0]
    });
    setCircuit(newCircuit);
  };
  
  // Run simulation
  const runSimulation = async () => {
    setError(null);
    setIsSimulating(true);
    
    try {
      const result = await simulationService.runCircuit(circuit, 1024);
      setSimulationResult(result);
    } catch (err) {
      setError(`Simulation error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSimulating(false);
    }
  };
  
  // Run Grover's algorithm
  const runGroverAlgorithm = () => {
    const grover = new GroverAlgorithm();
    const numQubits = 2; // Small example
    const markedItem = '11'; // Search for |11⟩
    const iterations = 1; // For 2 qubits, 1 iteration is optimal
    
    const groverCircuit = grover.createCircuit(numQubits, markedItem, iterations);
    setCircuit(groverCircuit);
  };
  
  // Create a dummy quantum state for visualization
  const createDummyState = (): QuantumState => {
    const qubits = 3;
    const dim = 1 << qubits;
    const vector = new Float64Array(dim * 2);
    
    // Create a superposition state
    vector[0] = 0.5; // |000⟩ real part
    vector[2] = 0.5; // |001⟩ real part
    vector[6] = 0.5; // |011⟩ real part
    vector[14] = 0.5; // |111⟩ real part
    
    return { qubits, vector };
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Quantum Computing Simulator</h1>
        <p>A browser-based quantum circuit visualizer and simulator with educational tooling</p>
      </header>
      
      <main className="app-content">
        <div className="tabs">
          <button 
            className={selectedTab === 'circuit' ? 'active' : ''} 
            onClick={() => setSelectedTab('circuit')}
          >
            Circuit Editor
          </button>
          <button 
            className={selectedTab === 'qasm' ? 'active' : ''} 
            onClick={() => setSelectedTab('qasm')}
          >
            QASM
          </button>
          <button 
            className={selectedTab === 'algorithms' ? 'active' : ''} 
            onClick={() => setSelectedTab('algorithms')}
          >
            Algorithms
          </button>
        </div>
        
        <div className="tab-content">
          {selectedTab === 'circuit' && (
            <div className="circuit-editor">
              <div className="circuit-tools">
                <GatePalette onSelectGate={handleGateSelect} />
              </div>
              
              <div className="circuit-canvas-container">
                <h3>Quantum Circuit</h3>
                <CircuitCanvas 
                  circuit={circuit} 
                  onCircuitChange={setCircuit}
                  width={800}
                  height={300}
                />
                
                <div className="circuit-controls">
                  <button 
                    className="run-button"
                    onClick={runSimulation}
                    disabled={isSimulating}
                  >
                    {isSimulating ? 'Simulating...' : 'Run Simulation'}
                  </button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
              </div>
            </div>
          )}
          
          {selectedTab === 'qasm' && (
            <div className="qasm-editor">
              <h3>QASM Code</h3>
              <textarea
                value={qasmCode}
                onChange={(e) => setQasmCode(e.target.value)}
                placeholder="Enter QASM code here..."
                rows={10}
              />
              <div className="qasm-controls">
                <button>Parse QASM</button>
                <button>Generate QASM from Circuit</button>
              </div>
            </div>
          )}
          
          {selectedTab === 'algorithms' && (
            <div className="algorithms">
              <h3>Quantum Algorithms</h3>
              <div className="algorithm-cards">
                <div className="algorithm-card">
                  <h4>Grover's Algorithm</h4>
                  <p>Quantum search algorithm that provides a quadratic speedup over classical search algorithms.</p>
                  <button onClick={runGroverAlgorithm}>Create Circuit</button>
                </div>
                
                <div className="algorithm-card">
                  <h4>Quantum Teleportation</h4>
                  <p>Protocol that transfers a quantum state using entanglement and classical communication.</p>
                  <button>Create Circuit</button>
                </div>
                
                <div className="algorithm-card">
                  <h4>Deutsch-Jozsa Algorithm</h4>
                  <p>Determines if a function is constant or balanced with a single evaluation.</p>
                  <button>Create Circuit</button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="visualization-section">
          <StateVisualizer 
            state={simulationResult?.finalState || createDummyState()}
            width={600}
            height={300}
            mode="bars"
          />
          
          {simulationResult && (
            <div className="measurement-results">
              <h3>Measurement Results</h3>
              <div className="results-grid">
                {Object.entries(simulationResult.measurements).map(([state, result]) => (
                  <div key={state} className="result-item">
                    <div className="result-state">|{state}⟩</div>
                    <div className="result-probability">{(result.probability * 100).toFixed(2)}%</div>
                    <div className="result-bar" style={{ width: `${result.probability * 100}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="educational-section">
          <h2>Educational Resources</h2>
          <div className="concepts-list">
            {quantumConcepts.map(concept => (
              <QuantumConcept key={concept.id} content={concept} />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Quantum Computing Simulator - Built with React, TypeScript, and WebGL</p>
      </footer>
    </div>
  );
}

export default App;
