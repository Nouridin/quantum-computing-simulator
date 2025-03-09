import React, { useEffect, useRef } from 'react';
import { QuantumState } from '../../core/types';
import './StateVisualizer.css';

interface StateVisualizerProps {
  state: QuantumState;
  width: number;
  height: number;
  mode?: 'bars' | 'circle' | 'bloch';
}

/**
 * Quantum State Visualizer Component
 * Visualizes quantum state probabilities
 */
export const StateVisualizer: React.FC<StateVisualizerProps> = ({
  state,
  width,
  height,
  mode = 'bars'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate probabilities from state vector
  const calculateProbabilities = (state: QuantumState): number[] => {
    const dim = 1 << state.qubits;
    const probabilities: number[] = [];
    
    for (let i = 0; i < dim; i++) {
      const realIdx = i * 2;
      const imagIdx = realIdx + 1;
      const real = state.vector[realIdx];
      const imag = state.vector[imagIdx];
      
      probabilities[i] = real * real + imag * imag;
    }
    
    return probabilities;
  };
  
  // Draw bar chart visualization
  const drawBarChart = (ctx: CanvasRenderingContext2D, probabilities: number[]) => {
    const numStates = probabilities.length;
    const barWidth = width / numStates;
    const maxProb = Math.max(...probabilities);
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw bars
    probabilities.forEach((prob, i) => {
      const barHeight = (prob / maxProb) * (height - 40);
      const x = i * barWidth;
      const y = height - barHeight - 20;
      
      // Draw bar
      ctx.fillStyle = `hsl(${240 - 240 * prob}, 70%, 60%)`;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
      
      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(2).padStart(state.qubits, '0'), x + barWidth / 2, height - 5);
      
      // Draw probability
      if (prob > 0.03) {
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((prob * 100).toFixed(1) + '%', x + barWidth / 2, y - 5);
      }
    });
  };
  
  // Draw circle visualization (quantum state as points on a circle)
  const drawCircleVisualization = (ctx: CanvasRenderingContext2D, state: QuantumState) => {
    const dim = 1 << state.qubits;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw circle
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();
    
    // Draw state vector points
    for (let i = 0; i < dim; i++) {
      const realIdx = i * 2;
      const imagIdx = realIdx + 1;
      const real = state.vector[realIdx];
      const imag = state.vector[imagIdx];
      
      const prob = real * real + imag * imag;
      if (prob < 0.001) continue; // Skip very small amplitudes
      
      // Calculate angle and magnitude
      const angle = Math.atan2(imag, real);
      const magnitude = Math.sqrt(prob);
      
      // Draw point
      const x = centerX + radius * magnitude * Math.cos(angle);
      const y = centerY + radius * magnitude * Math.sin(angle);
      
      ctx.fillStyle = `rgba(70, 130, 180, ${magnitude})`;
      ctx.beginPath();
      ctx.arc(x, y, 5 + magnitude * 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(2).padStart(state.qubits, '0'), x, y - 10);
    }
  };
  
  // Render visualization based on mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Draw visualization based on mode
    if (mode === 'bars') {
      const probabilities = calculateProbabilities(state);
      drawBarChart(ctx, probabilities);
    } else if (mode === 'circle') {
      drawCircleVisualization(ctx, state);
    } else if (mode === 'bloch') {
      // Bloch sphere visualization would go here
      // This is more complex and would require 3D rendering
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Bloch sphere visualization (3D)', width / 2, height / 2);
    }
  }, [state, width, height, mode]);
  
  return (
    <div className="state-visualizer">
      <h3>Quantum State Visualization</h3>
      <div className="visualization-container">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
      <div className="visualization-controls">
        <div className="state-info">
          <p>Qubits: {state.qubits}</p>
          <p>Dimensions: {1 << state.qubits}</p>
        </div>
      </div>
    </div>
  );
}; 