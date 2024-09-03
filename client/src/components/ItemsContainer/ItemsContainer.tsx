import React, {FC, ReactNode} from 'react';
import './ItemsContainer.css';

interface ItemsContainerProps {
    children: ReactNode
}

const ItemsContainer: FC<ItemsContainerProps> = ({ children }) => {
    return (
        <div className="ItemsContainer--container">
            {children}
        </div>
    );
};

export default ItemsContainer;