import React, {FC, useEffect, useState} from 'react';
import Cell from "../../../../components/Cell/Cell";
import Icon16Chevron from "../../../../assets/icons/Icon16Chevron";
import './MyTeamButton.css';
import {useNavigate} from "react-router-dom";
import {ROUTE_TEAM, ROUTE_TEAMS} from "../../../../routes";
import {useDispatch, useSelector} from "react-redux";
import {DefaultStateType} from "../../../../store/reducer";
import {useTranslation} from "react-i18next";
import {formatNumberWithSpaces} from "../../../../utils/numbers";

interface MyTeamButtonProps {

}

const { t } = useTranslation();

const MyTeamButton: FC<MyTeamButtonProps> = ({}) => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const team = useSelector((selector: DefaultStateType) => selector.team);

    return (
        <>
            {team !== null && (
                <div className="MyTeamButton--container">
                    {team !== 'no' && team && (
                        <>
                            <div
                                className="MyTeamButton--join"
                                onClick={() => navigate(ROUTE_TEAM)}
                            >
                                <p>{team.name}</p>
                                <Icon16Chevron/>
                            </div>
                        </>
                    )}

                    {team === 'no' && (
                        <div
                            className="MyTeamButton--join"
                            onClick={() => navigate(ROUTE_TEAMS)}
                        >
                            <p>{t('Присоединиться')}</p>
                            <Icon16Chevron/>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default MyTeamButton;