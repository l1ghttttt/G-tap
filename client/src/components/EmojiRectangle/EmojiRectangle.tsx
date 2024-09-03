import React, {FC, ReactNode} from 'react';
import './EmojiRectangle.css';

interface EmojiRectangleProps {
    children: ReactNode
}

const EmojiRectangle: FC<EmojiRectangleProps> = ({ children }) => {
    return (
        <div className="EmojiRectangle--container">
            {children}
        </div>
    );
};

export default EmojiRectangle;