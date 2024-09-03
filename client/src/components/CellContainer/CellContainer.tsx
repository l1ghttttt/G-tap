import React, {FC, ReactNode} from 'react';
import './CellContainer.css';

interface CellContainerProps {
    children: ReactNode
}

const CellContainer: FC<CellContainerProps> = ({ children }) => {
    return (
        <div className="CellContainer--container">
            {children}
        </div>
    );
};

export default CellContainer;