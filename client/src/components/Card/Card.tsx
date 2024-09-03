import React, {FC, ReactNode} from 'react';
import './Card.css';

interface CardProps {
    children: ReactNode
    onClick?: any
}

const Card: FC<CardProps> = ({ children, onClick }) => {
    return (
        <div
            className="Card Card--container"
            onClick={onClick}
        >
            <div className="Card--content">
                {children}
            </div>
        </div>
    );
};

export default Card;