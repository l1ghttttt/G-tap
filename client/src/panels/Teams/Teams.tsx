import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Placeholder from "../../components/Placeholder/Placeholder";
import Img from "../../components/Img/Img";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import Spacing from "../../components/Spacing/Spacing";
import Icon16Chevron from "../../assets/icons/Icon16Chevron";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import {Button, Skeleton} from "@nextui-org/react";
import Div from "../../components/Div/Div";
import {useNavigate} from "react-router-dom";
import {ROUTE_CREATE_TEAM, ROUTE_HOME, ROUTE_TEAM} from "../../routes";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../store/reducer";
import {fetchData, getImageUrl} from "../../utils/api";
import {formatNumberShort} from "../../utils/numbers";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import Icon22UsersCircle from "../../assets/icons/Icon22UsersCircle";

const Teams: FC = () => {

    const [teams, setTeams] = useState<any>(null);
    const [teamsLoading, setTeamsLoading] = useState(false);

    const navigate = useNavigate();

    const myTeam = useSelector((selector: DefaultStateType) => selector.team);
    const { t } = useTranslation();

    useEffect(() => {
        fetchTeams().then();
    }, []);

    const fetchTeams = async () => {
        if (myTeam !== null && myTeam !== 'no') {
            navigate(ROUTE_HOME, { replace: true });
            return;
        }

        setTeamsLoading(true);

        const response = await fetchData('/teams/get');
        if (response.error) {
            return;
        }

        console.log(response.result);
        setTeams(response.result);
        setTeamsLoading(false);
    }

    return (
        <Panel>
            <TelegramBackButton />

            <Placeholder
                title={t("Сквады")}
                text={t("Присоединяйся к команде и получи 4 TON и 100 000 G")}
            />

            <Spacing size={32} />

            <CellContainer>
                {teamsLoading && (
                    <>
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                                marginTop: 16,
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                                marginTop: 16,
                            }}
                        />
                    </>
                )}

                {!teamsLoading && teams !== null && teams.map((team: any, index: number) => (
                    <Cell
                        key={index}
                        /*before={team.photo ? (
                            <Img
                                src={getImageUrl(team.photo)}
                            />
                        ) : (
                            <LetterAvatar width={48} height={48} />
                        )}*/
                        before={
                            <EmojiRectangle>
                                <Icon22UsersCircle />
                            </EmojiRectangle>
                        }
                        after={<Icon16Chevron />}
                        title={team.name}
                        onClick={() => navigate(`${ROUTE_TEAM}/${team.id}`)}
                    >
                        {formatNumberShort(team.gold)} G
                    </Cell>
                ))}
            </CellContainer>

            <Spacing size={80} />

            {/*<BottomLayout>
                <Div>
                    <Button
                        size="lg"
                        color="primary"
                        onClick={() => navigate(ROUTE_CREATE_TEAM)}
                        fullWidth
                    >
                        Create squade
                    </Button>
                </Div>
                <Spacing />
            </BottomLayout>*/}
        </Panel>
    );
};

export default Teams;