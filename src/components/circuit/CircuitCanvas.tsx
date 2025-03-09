import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva';
import { QuantumCircuit, CircuitOperation } from '../../core/types';
import { standardGates } from '../../core/math/gates';

interface CircuitCanvasProps {
  circuit: QuantumCircuit;
  onCircuitChange?: (circuit: QuantumCircuit) => void;
  width: number;
  height: number;
  editable?: boolean;
}

// Constants for drawing
const QUBIT_LINE_SPACING = 60;
const GATE_WIDTH = 40;
const GATE_HEIGHT = 40;
const GATE_SPACING = 60;
const MARGIN_LEFT = 80;
const MARGIN_TOP = 40;

/**
 * Quantum Circuit Canvas Component
 * Renders a quantum circuit using Konva
 */
export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  circuit,
  onCircuitChange,
  width,
  height,
  editable = true
}) => {
  const stageRef = useRef<any>(null);
  const [selectedGate, setSelectedGate] = useState<number | null>(null);
  
  // Calculate positions for rendering
  const getQubitLineY = (qubitIndex: number) => MARGIN_TOP + qubitIndex * QUBIT_LINE_SPACING;
  const getGateX = (stepIndex: number) => MARGIN_LEFT + stepIndex * GATE_SPACING;
  
  // Group operations by time step
  const operationsByStep: CircuitOperation[][] = [];
  circuit.operations.forEach(op => {
    const step = op.targets[0]; // Simplified - in a real app, we'd track step explicitly
    if (!operationsByStep[step]) {
      operationsByStep[step] = [];
    }
    operationsByStep[step].push(op);
  });
  
  // Render a single gate
  const renderGate = (operation: CircuitOperation, stepIndex: number) => {
    const { gate, targets, controls = [] } = operation;
    const x = getGateX(stepIndex);
    const y = getQubitLineY(targets[0]);
    
    return (
      <Group
        key={`gate-${stepIndex}-${targets.join('-')}`}
        x={x}
        y={y}
        width={GATE_WIDTH}
        height={GATE_HEIGHT}
        onClick={() => setSelectedGate(stepIndex)}
        draggable={editable}
      >
        <Rect
          width={GATE_WIDTH}
          height={GATE_HEIGHT}
          fill={selectedGate === stepIndex ? '#9c88ff' : '#70a1ff'}
          stroke="#000"
          strokeWidth={1}
          cornerRadius={4}
          x={-GATE_WIDTH / 2}
          y={-GATE_HEIGHT / 2}
        />
        <Text
          text={gate.symbol}
          fontSize={16}
          fill="#fff"
          align="center"
          verticalAlign="middle"
          width={GATE_WIDTH}
          height={GATE_HEIGHT}
          x={-GATE_WIDTH / 2}
          y={-GATE_HEIGHT / 2}
        />
        
        {/* Render control lines if this is a controlled gate */}
        {controls.map(controlQubit => {
          const controlY = getQubitLineY(controlQubit);
          const targetY = getQubitLineY(targets[0]);
          return (
            <Line
              key={`control-${controlQubit}-${targets[0]}`}
              points={[0, controlY - y, 0, targetY - y]}
              stroke="#000"
              strokeWidth={2}
            />
          );
        })}
        
        {/* Render control points */}
        {controls.map(controlQubit => {
          const controlY = getQubitLineY(controlQubit);
          return (
            <Rect
              key={`control-point-${controlQubit}`}
              x={-4}
              y={controlY - y - 4}
              width={8}
              height={8}
              fill="#000"
            />
          );
        })}
      </Group>
    );
  };
  
  // Render qubit lines
  const renderQubitLines = () => {
    const lines = [];
    for (let i = 0; i < circuit.numQubits; i++) {
      const y = getQubitLineY(i);
      lines.push(
        <Group key={`qubit-${i}`}>
          <Text
            text={`q${i}:`}
            x={10}
            y={y - 10}
            fontSize={16}
          />
          <Line
            points={[MARGIN_LEFT - 20, y, width - 20, y]}
            stroke="#000"
            strokeWidth={1}
          />
        </Group>
      );
    }
    return lines;
  };
  
  // Render measurement points
  const renderMeasurements = () => {
    return circuit.measurements.map((measurement, index) => {
      const { qubit } = measurement;
      const x = width - 60;
      const y = getQubitLineY(qubit);
      
      return (
        <Group key={`measurement-${index}`} x={x} y={y}>
          <Rect
            width={30}
            height={30}
            fill="#fff"
            stroke="#000"
            strokeWidth={1}
            x={-15}
            y={-15}
          />
          <Text
            text="M"
            fontSize={16}
            fill="#000"
            align="center"
            verticalAlign="middle"
            width={30}
            height={30}
            x={-15}
            y={-15}
          />
        </Group>
      );
    });
  };
  
  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        {/* Render qubit lines */}
        {renderQubitLines()}
        
        {/* Render gates */}
        {circuit.operations.map((operation, index) => 
          renderGate(operation, index)
        )}
        
        {/* Render measurements */}
        {renderMeasurements()}
      </Layer>
    </Stage>
  );
}; 