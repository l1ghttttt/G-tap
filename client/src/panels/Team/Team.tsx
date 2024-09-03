import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import TeamHeader from "./components/TeamHeader/TeamHeader";
import TeamInfo from "./components/TeamInfo/TeamInfo";
import Spacing from "../../components/Spacing/Spacing";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import Img from "../../components/Img/Img";
import {useDispatch, useSelector} from "react-redux";
import {ADD_CRYSTALS, DefaultStateType, getDispatchObject, SET_TEAM, SET_USER_ADD_BALANCE} from "../../store/reducer";
import {fetchData, getImageUrl, getTelegramImageUrl} from "../../utils/api";
import {useLocation, useNavigate} from "react-router-dom";
import {getIdFromPathname} from "../../utils/utils";
import {formatNumberWithSpaces} from "../../utils/numbers";

const Team: FC = () => {

    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState<any>(null);

    const dispatch = useDispatch();
    const myTeam = useSelector((selector: DefaultStateType) => selector.team);

    const location = useLocation();
    const navigate = useNavigate();
    const id = getIdFromPathname(location);

    useEffect(() => {
        fetch().then();
    }, []);

    const fetch = async () => {
        if (myTeam !== null) {
            if (myTeam !== 'no' && id === myTeam.id) {
                setTeam(myTeam);
                return;
            }

            if (myTeam !== 'no' && id === null) {
                setTeam(myTeam);
                return;
            }
        }

        if (id === null) {
            return;
        }

        await fetchTeam(id);
    }

    const fetchTeam = async (teamId: number) => {
        setLoading(true);

        const response = await fetchData(
            '/team/get',
            { id: teamId }
        );

        if (response.error) {
            return;
        }

        setTeam(response.result);
        setLoading(false);

        return response.result;
    }

    const onJoin = async () => {
        if (team === null) {
            return;
        }

        const data = await fetchTeam(team.id);
        dispatch(getDispatchObject(SET_TEAM, data));

        dispatch(getDispatchObject(ADD_CRYSTALS, 4));
        dispatch(getDispatchObject(SET_USER_ADD_BALANCE, 100000));
    }

    const onLeave = async () => {
        if (team === null) {
            return;
        }

        await fetchTeam(team.id);
        dispatch(getDispatchObject(SET_TEAM, 'no'));
    }

    return (
        <Panel>
            <TelegramBackButton />

            {loading && (
                'loading'
            )}

            {!loading && team && (
                <>
                    <TeamHeader
                        name={team.name}
                        link={team.link}
                    />

                    <Spacing size={32} />

                    <TeamInfo
                        id={team.id}
                        gold={team.gold}
                        link={team.link}
                        players={team.usersCount}
                        role={team.role}
                        onJoin={onJoin}
                        onLeave={onLeave}
                    />

                    <Spacing size={16} />

                    {/*<CellContainer>
                        {team.topUsers.map((user: any, index: any) => (
                            <Cell
                                key={index}
                                before={<Img src={getTelegramImageUrl(user.image)} />}
                                title={user.name}
                            >
                                {formatNumberWithSpaces(user.gold)} G
                            </Cell>
                        ))}
                    </CellContainer>*/}
                </>
            )}
        </Panel>
    );
};

export default Team;