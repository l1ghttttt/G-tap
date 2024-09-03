import React, {FC} from 'react';
import './Header.css';
import NameBlock from "../NameBlock/NameBlock";
import {getTG} from "../../../../utils/utils";
import ChannelBlock from "../ChannelBlock/ChannelBlock";

interface HeaderProps {

}

const Header: FC<HeaderProps> = ({}) => {
    const tg = getTG();

    // Проверяем наличие необходимых данных
    const username = tg?.initDataUnsafe?.user?.username;

    return (
        <div className="Header--container">
            <div className="Header--left">
                {/* Показать сообщение или пустое значение, если username отсутствует */}
                <NameBlock name={username || 'Default Name'} />
            </div>

            <div className="Header--right">
                <ChannelBlock />
            </div>
        </div>
    );
};


export default Header;

