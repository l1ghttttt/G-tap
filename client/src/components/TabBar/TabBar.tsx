import React, {FC} from 'react';
import './TabBar.css';
import TabBarItem from "../TabBarItem/TabBarItem";
import Icon28Home from "../../assets/icons/Icon28Home";
import Icon28NewUser from "../../assets/icons/Icon28NewUser";
import Icon28Calendar from "../../assets/icons/Icon28Calendar";
import Icon28Store from "../../assets/icons/Icon28Store";
import {useLocation, useNavigate} from "react-router-dom";
import {ROUTE_FRIENDS, ROUTE_HOME, ROUTE_MARKET, ROUTE_TASKS} from "../../routes";
import {useTranslation} from "react-i18next";

const TABS = [
    {
        icon: <Icon28Home />,
        text: "Главная",
        route: ROUTE_HOME,
    },
    {
        icon: <Icon28NewUser />,
        text: "Друзья",
        route: ROUTE_FRIENDS,
    },
    {
        icon: <Icon28Calendar />,
        text: "Задания",
        route: ROUTE_TASKS,
    },
    {
        icon: <Icon28Store />,
        text: "Маркет",
        route: ROUTE_MARKET,
    },
];

const TabBar: FC = () => {

    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="TabBar--container">
            <div className="TabBar--content">
                {TABS.map((tab, index) => (
                    <TabBarItem
                        key={index}
                        icon={tab.icon}
                        text={ t(`${tab.text}`) }
                        selected={location.pathname === tab.route}
                        onClick={() => navigate(tab.route, {replace: true})}
                    />
                ))}
            </div>
        </div>
    );
};

export default TabBar;