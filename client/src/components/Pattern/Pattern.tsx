import React from 'react';
import './Pattern.css';

interface PatternProps {}

const Pattern: React.FC<PatternProps> = () => {
    const createPattern = (offsetY: number) => {
        const patterns = [];
        const patternSize = 85;
        const rotationDegrees = 5;

        for (let i = 0; i < (window.innerHeight * 2) / patternSize; i++) {
            for (let j = 0; j < (window.innerWidth * 2) / patternSize; j++) {
                patterns.push(
                    <div
                        className="pattern"
                        style={{
                            top: `${i * patternSize + offsetY}px`,
                            left: `${j * patternSize}px`,
                            transform: `rotate(${rotationDegrees}deg)`,
                        }}
                        key={`${i}-${j}-${offsetY}`}
                    >
                        G
                    </div>
                );
            }
        }
        return patterns;
    };

    return (
        <div className="pattern-container">
            <div className="pattern-wrapper">
                <div className="pattern-rotate">
                    {createPattern(0)}
                </div>

                <div className="pattern-rotate">
                    {createPattern(window.innerHeight * 2)}
                </div>
            </div>
        </div>
    );
};

export default Pattern;
