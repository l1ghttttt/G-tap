import React, {FC, ReactNode} from 'react';
import './BottomLayout.css';

interface BottomLayoutProps {
    filled?: boolean
    children: ReactNode
}

const BottomLayout: FC<BottomLayoutProps> = ({ children, filled = false }) => {
    return (
        <div
            className="BottomLayout--container"
            style={{
                background: filled ? "var(--background_color)" : "transparent"
            }}
        >
            {children}
        </div>
    );
};

export default BottomLayout;