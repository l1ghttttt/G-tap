import React, {FC} from 'react';
import './TeamInfo.css';
import {Button} from "@nextui-org/react";
import {useTranslation} from "react-i18next";
import {fetchData} from "../../../../utils/api";
import {useNavigate} from "react-router-dom";
import {ROUTE_TEAM_SETTINGS} from "../../../../routes";
import {copyText, getTG} from "../../../../utils/utils";
import {formatNumberShort, formatNumberWithSpaces} from "../../../../utils/numbers";
import Card from "../../../../components/Card/Card";
import CardContainer from "../../../../components/CardContainer/CardContainer";
import Spacing from "../../../../components/Spacing/Spacing";
import CellContainer from "../../../../components/CellContainer/CellContainer";
import Cell from "../../../../components/Cell/Cell";
import Icon16Chevron from "../../../../assets/icons/Icon16Chevron";
import Img from "../../../../components/Img/Img";

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

interface TeamInfoProps {
    id: number
    gold: number
    players: number
    role: 'guest' | 'member' | 'admin'
    link: any
    onJoin: () => void
    onLeave: () => void
}

const TeamInfo: FC<TeamInfoProps> = ({ id, gold, link, players, role, onJoin, onLeave }) => {


    const { t } = useTranslation();
    const navigate = useNavigate();

    const join = async () => {
        const response = await fetchData(
            '/team/join',
            { id }
        );

        if (response.error) {
            return;
        }

        if (response.result === 'did not join') {
            getTG().showAlert(t('Подписывайтесь на канал команды!'));
            return;
        }

        onJoin();
    }


    const leave = async () => {
        const response = await fetchData(
            '/team/leave',
            { id }
        );

        if (response.error) {
            return;
        }

        onLeave();
    }

    const invite = () => {
        const link = `${process.env.REACT_APP_TELEGRAM_BOT_URL}?start=t_${tg['initDataUnsafe']['user']['id']}_${id}`
        copyText(link);
    }

    return (
        <div className="TeamInfo--container">
            <CardContainer>
                <Card>
                    <div className="Market--current-earnings">
                        <p>{formatNumberWithSpaces(players)}</p>
                        <span>игроков</span>
                    </div>
                </Card>

                <Card>
                    <div className="Market--current-earnings">
                        <p>{formatNumberWithSpaces(players / 3)}</p>
                        <span>игроков за день</span>
                    </div>
                </Card>
            </CardContainer>

            <Spacing size={16} />

            {/*<Card>
                <div className="Market--current-earnings">
                    <p>{formatNumberShort(gold)} G</p>
                    <span>coins</span>
                </div>
            </Card>*/}

            <CellContainer>
                <Cell
                    before={<Img src={require('../../../../assets/images/social/telegram.png')} />}
                    size="md"
                    title={t("Telegram канал")}
                    after={<Icon16Chevron />}
                    onClick={() => getTG().openTelegramLink(link)}
                />
            </CellContainer>

            <div className="TeamInfo--actions">
                {role === 'guest' && (
                    <Button
                        size="lg"
                        onClick={join}
                        color="primary"
                        fullWidth
                    >
                        {t('Вступить')}
                    </Button>
                )}

                {role === 'member' && (
                    <Button
                        size="lg"
                        onClick={leave}
                        color="secondary"
                        fullWidth
                    >
                        {t('Покинуть')}
                    </Button>
                )}

                {/*{role === 'admin' && (
                    <Button
                        size="lg"
                        onClick={() => navigate(ROUTE_TEAM_SETTINGS)}
                        color="secondary"
                        fullWidth
                    >
                        {t('teamSettings')}
                    </Button>
                )}*/}

                {/*{['member', 'admin'].includes(role) && (
                    <Button
                        size="lg"
                        onClick={invite}
                        color="primary"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        {t('teamInvite')}
                    </Button>
                )}*/}
            </div>
        </div>
    );
};

export default TeamInfo;