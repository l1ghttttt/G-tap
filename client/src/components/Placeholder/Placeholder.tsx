import {FC, ReactNode} from 'react';
import './Placeholder.css';

interface PlaceholderProps {
    children?: ReactNode
    title?: string
    text?: string
}

const Placeholder: FC<PlaceholderProps> = ({ children, title, text }) => {
    return (
        <div className="Placeholder--container">
            {children}

            {title && (
                <h2>{title}</h2>
            )}

            {text && (
                <p>{text}</p>
            )}
        </div>
    );
};

export default Placeholder;