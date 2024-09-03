import React, {FC, useEffect} from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./panels/Home/Home";
import {
    ROUTE_ADMIN,
    ROUTE_CREATE_TEAM,
    ROUTE_FRIENDS,
    ROUTE_HOME,
    ROUTE_MARKET,
    ROUTE_TASKS,
    ROUTE_TEAM,
    ROUTE_TEAMS,
} from "./routes";
import {fetchData} from "./utils/api";
import {
    DefaultStateType,
    getDispatchObject,
    SET_APP,
    SET_SCREEN_POPUP,
    SET_TEAM,
    SET_USER
} from "./store/reducer";
import {useDispatch, useSelector} from "react-redux";
import ScreenLoader from "./components/ScreenLoader/ScreenLoader";
import Friends from "./panels/Friends/Friends";
import Tasks from "./panels/Tasks/Tasks";
import Market from "./panels/Market/Market";
import TaskSocialModal from "./modals/TaskSocialModal";
import AdminTaskModal from "./modals/AdminTaskModal";
import Admin from "./panels/Admin/Admin";
import MinerBuyModal from "./modals/MinerBuyModal";
import Teams from "./panels/Teams/Teams";
import Team from "./panels/Team/Team";
import TeamCreate from "./panels/TeamCreate/TeamCreate";

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

const App: FC = () => {

    const dispatch = useDispatch();
    const selector = useSelector((s: DefaultStateType) => s);

    useEffect(() => {
        init().then();
    }, []);

    const init = async () => {
        await fetch();
    }

    const fetch = async () => {
        try {
            const response = await fetchData('/init');

            // Проверьте, что response и result не равны null
            if (response && response.result) {
                const { result } = response;

                // Проверьте, что result не равен null и имеет необходимые свойства
                if (result) {
                    dispatch(getDispatchObject(SET_USER, result['user']));
                    dispatch(getDispatchObject(SET_APP, result['app']));
                    dispatch(getDispatchObject(SET_TEAM, result['team']));
                } else {
                    console.error('Result is null or undefined');
                    // Здесь можно обработать ошибку или назначить значения по умолчанию
                }
            } else {
                console.error('Response is null or result is missing');
                // Здесь можно обработать ошибку или назначить значения по умолчанию
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Обработка ошибок сети или других проблем
        }
    };

    return (
        <>
            <ScreenLoader
                content={selector.screenPopup}
            />

            <BrowserRouter>
                <Routes>
                    <Route path={ROUTE_HOME} element={<Home />} />
                    <Route path={ROUTE_FRIENDS} element={<Friends />} />
                    <Route path={ROUTE_TASKS} element={<Tasks />} />
                    <Route path={ROUTE_MARKET} element={<Market />} />
                    <Route path={ROUTE_ADMIN} element={<Admin />} />
                    <Route path={ROUTE_TEAMS} element={<Teams />} />
                    <Route path={`${ROUTE_TEAM}/:id?`} element={<Team />} />
                    <Route path={ROUTE_CREATE_TEAM} element={<TeamCreate />} />
                    <Route path="*">panel not found</Route>
                </Routes>
            </BrowserRouter>

            <>
                <TaskSocialModal />
                <AdminTaskModal />
                <MinerBuyModal />
            </>
        </>
    );
};

export default App;