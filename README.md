# Quantum Computing Simulator

A browser-based quantum circuit visualizer and simulator with educational tooling.

## Overview

This project is a comprehensive quantum computing simulator that allows users to:

- Design quantum circuits with a drag-and-drop interface
- Simulate quantum algorithms with state vector calculations
- Visualize quantum states and measurement probabilities
- Learn about quantum computing concepts through interactive tutorials
- Import and export circuits using QASM (Quantum Assembly Language)

## Features

### Quantum Circuit Visualization
- Interactive circuit canvas using React and Konva.js
- Drag-and-drop quantum gates (Hadamard, CNOT, Toffoli, etc.)
- Real-time visualization of qubit states

### Quantum State Vector Engine
- Efficient state vector simulation using TypeScript and WebAssembly
- Support for complex number operations and matrix calculations
- Measurement simulation with probabilistic outcomes

### Built-in Quantum Algorithms
- Grover's Algorithm for unstructured search
- Quantum Teleportation
- Deutsch-Jozsa Algorithm
- More algorithms coming soon!

### Educational Resources
- Interactive explanations of quantum computing concepts
- Visualizations of quantum phenomena like superposition and entanglement
- Difficulty levels for beginners to advanced users

### QASM Support
- Import and export circuits using OpenQASM 2.0
- Syntax highlighting and validation

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Visualization**: Konva.js, Three.js (React Three Fiber)
- **State Management**: Jotai
- **Math**: Math.js for complex number operations
- **Concurrency**: Web Workers with Comlink for heavy computations
- **Testing**: Jest, Vitest, Cypress

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Nouridin/quantum-computing-simulator.git
cd quantum-computing-simulator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

### Creating a Circuit

1. Select the "Circuit Editor" tab
2. Choose gates from the palette on the left
3. Click on the circuit grid to place gates
4. Add measurements to qubits as needed
5. Click "Run Simulation" to execute the circuit

### Using QASM

1. Select the "QASM" tab
2. Enter QASM code in the editor
3. Click "Parse QASM" to convert to a circuit
4. Alternatively, create a circuit and click "Generate QASM" to get the code

### Running Algorithms

1. Select the "Algorithms" tab
2. Choose an algorithm from the available options
3. Configure parameters if needed
4. Click "Create Circuit" to generate the circuit
5. Run the simulation to see the results

## Development

### Project Structure

```
src/
├── components/         # React components
│   ├── circuit/        # Circuit editor components
│   ├── visualization/  # State visualization components
│   └── educational/    # Educational content components
├── core/               # Core quantum simulation logic
│   ├── engine/         # State vector simulation engine
│   ├── math/           # Quantum math utilities
│   ├── qasm/           # QASM parser and generator
│   ├── algorithms/     # Quantum algorithm implementations
│   └── services/       # Service layer for the UI
├── workers/            # Web Worker implementations
└── App.tsx             # Main application component
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Qiskit](https://qiskit.org/) for inspiration and educational resources
- [Quantum Computing Playground](https://www.quantumplayground.net/) for visualization ideas
- [OpenQASM](https://github.com/openqasm/openqasm) for the quantum assembly language specification
