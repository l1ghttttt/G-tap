import React, {FC, ReactNode} from 'react';
import './TabBarItem.css';

interface TabBarItemProps {
    icon: ReactNode
    text: string
    selected: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const TabBarItem: FC<TabBarItemProps> = ({ icon, text, selected, onClick }) => {
    return (
        <div
            className={"TabBarItem--container" + (selected ? '' : ' TabBarItem--container--disable')}
            onClick={onClick}
        >
            {icon}
            <p>{text}</p>
        </div>
    );
};

export default TabBarItem;