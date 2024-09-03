import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import Placeholder from "../../components/Placeholder/Placeholder";
import Spacing from "../../components/Spacing/Spacing";
import Pattern from "../../components/Pattern/Pattern";
import TabBar from "../../components/TabBar/TabBar";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import {useNavigate} from "react-router-dom";
import useModal from "../../hooks/useModal";
import {fetchData} from "../../utils/api";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../components/Img/Img";
import {formatNumberWithSpaces} from "../../utils/numbers";
import Icon16Chevron from "../../assets/icons/Icon16Chevron";
import {MODAL_TASK_SOCIAL} from "../../routes";
import {getSocialIconByUrl} from "../../utils/utils";
import ScreenDone from "../../components/ScreenDone/ScreenDone";
import TaskItem from "./components/TaskItem/TaskItem";
import {useTranslation} from "react-i18next";

interface TasksProps {

}

const Tasks: FC<TasksProps> = ({}) => {

    const [showDone, setShowDone] = useState(false);

    const [tasks, setTasks] = useState<any>(null);
    const [tasksLoading, setTasksLoading] = useState(false);

    const navigate = useNavigate();
    const {setActiveModal} = useModal();

    useEffect(() => {
        fetch().then();
        createEventListeners();

        return () => {
            removeEventListeners();
        }
    }, []);

    const showDoneAnimation = () => {
        setShowDone(true);
        setTimeout(() => setShowDone(false), 1200);
    }

    const createEventListeners = () => {
        document.addEventListener("TASKS_UPDATE", fetch);
        document.addEventListener("SHOW_DONE_ANIMATION", () => {
            showDoneAnimation();
        });
    }

    const removeEventListeners = () => {
        document.removeEventListener("TASKS_UPDATE", fetch);
    }

    const fetch = async () => {
        setTasksLoading(true);

        const response = await fetchData('/tasks/get');
        console.log(response)

        if (response.error) {
            return;
        }

        setTasks(response.result);
        setTasksLoading(false);
    }

    const { t } = useTranslation();

    return (
        <Panel>
            <Pattern />

            <Placeholder
                title={t("Задания")}
                text={t("Выполняйте простые задания и получайте награды")}
            />

            <Spacing size={32} />

            {(!tasksLoading && tasks !== null) && (
                <CellContainer>
                    {tasks.social.reverse().map((channel: any, index: number) => (
                        <TaskItem key={index} channel={channel} />
                    ))}
                </CellContainer>
            )}

            <BottomLayout>
                <TabBar />
            </BottomLayout>

            {showDone && (
                <ScreenDone />
            )}
        </Panel>
    );
};

export default Tasks;