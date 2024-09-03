import React, {FC, ReactNode} from 'react';
import './TopLayout.css';

interface TopLayoutProps {
    filled?: boolean
    children: ReactNode
}

const TopLayout: FC<TopLayoutProps> = ({ children, filled = false }) => {
    return (
        <div
            className="TopLayout--container"
            style={{
                background: filled ? "var(--background_color)" : "transparent"
            }}
        >
            {children}
        </div>
    );
};

export default TopLayout;