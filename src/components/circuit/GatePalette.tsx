import React from 'react';
import { QuantumGate } from '../../core/types';
import { standardGates } from '../../core/math/gates';
import './GatePalette.css'; // We'll create this CSS file next

interface GatePaletteProps {
  onSelectGate: (gate: QuantumGate) => void;
}

/**
 * Gate Palette Component
 * Displays available quantum gates for circuit construction
 */
export const GatePalette: React.FC<GatePaletteProps> = ({ onSelectGate }) => {
  // Group gates by category
  const gateCategories = {
    'Single-Qubit Gates': [
      standardGates.identity,
      standardGates.pauliX,
      standardGates.pauliY,
      standardGates.pauliZ,
      standardGates.hadamard,
      standardGates.sGate,
      standardGates.tGate
    ],
    'Multi-Qubit Gates': [
      standardGates.cnot,
      standardGates.swap,
      standardGates.toffoli
    ]
  };
  
  return (
    <div className="gate-palette">
      <h3>Gate Palette</h3>
      
      {Object.entries(gateCategories).map(([category, gates]) => (
        <div key={category} className="gate-category">
          <h4>{category}</h4>
          <div className="gate-grid">
            {gates.map(gate => (
              <div
                key={gate.name}
                className="gate-item"
                onClick={() => onSelectGate(gate)}
                title={gate.description}
              >
                <div className="gate-symbol">{gate.symbol}</div>
                <div className="gate-name">{gate.name}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 