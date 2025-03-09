import React, { useState } from 'react';
import { EducationalContent, ExplanationLevel } from '../../core/types';
import './QuantumConcept.css';

interface QuantumConceptProps {
  content: EducationalContent;
  onLevelChange?: (level: ExplanationLevel) => void;
}

/**
 * Quantum Concept Component
 * Displays educational content about quantum computing concepts
 */
export const QuantumConcept: React.FC<QuantumConceptProps> = ({
  content,
  onLevelChange
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Handle level change
  const handleLevelChange = (level: ExplanationLevel) => {
    if (onLevelChange) {
      onLevelChange(level);
    }
  };
  
  return (
    <div className={`quantum-concept ${expanded ? 'expanded' : ''}`}>
      <div className="concept-header" onClick={() => setExpanded(!expanded)}>
        <h3>{content.title}</h3>
        <div className="concept-level">
          <span className={content.level === ExplanationLevel.BEGINNER ? 'active' : ''}
                onClick={(e) => { e.stopPropagation(); handleLevelChange(ExplanationLevel.BEGINNER); }}>
            Beginner
          </span>
          <span className={content.level === ExplanationLevel.INTERMEDIATE ? 'active' : ''}
                onClick={(e) => { e.stopPropagation(); handleLevelChange(ExplanationLevel.INTERMEDIATE); }}>
            Intermediate
          </span>
          <span className={content.level === ExplanationLevel.ADVANCED ? 'active' : ''}
                onClick={(e) => { e.stopPropagation(); handleLevelChange(ExplanationLevel.ADVANCED); }}>
            Advanced
          </span>
        </div>
        <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
      </div>
      
      {expanded && (
        <div className="concept-content">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
          
          {content.relatedGates && content.relatedGates.length > 0 && (
            <div className="related-section">
              <h4>Related Gates</h4>
              <div className="related-tags">
                {content.relatedGates.map(gate => (
                  <span key={gate} className="related-tag">{gate}</span>
                ))}
              </div>
            </div>
          )}
          
          {content.relatedConcepts && content.relatedConcepts.length > 0 && (
            <div className="related-section">
              <h4>Related Concepts</h4>
              <div className="related-tags">
                {content.relatedConcepts.map(concept => (
                  <span key={concept} className="related-tag">{concept}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 