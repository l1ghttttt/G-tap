import {Children, FC, ReactNode} from 'react';
import './CardContainer.css';

interface CardContainerProps {
    children: ReactNode;
}

const CardContainer: FC<CardContainerProps> = ({ children }) => {
    return (
        <div className="CardContainer--container">
            {Children.map(children, (child, index) => (
                <div key={index} className="CardContainer--item">
                    {child}
                </div>
            ))}
        </div>
    );
};

export default CardContainer;
