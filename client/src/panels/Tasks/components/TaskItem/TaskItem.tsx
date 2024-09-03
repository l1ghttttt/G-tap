import React, {FC, useState} from 'react';
import Icon16Chevron from "../../../../assets/icons/Icon16Chevron";
import EmojiRectangle from "../../../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../../../components/Img/Img";
import {getSocialIconByUrl, getTG} from "../../../../utils/utils";
import {formatNumberWithSpaces} from "../../../../utils/numbers";
import Cell from "../../../../components/Cell/Cell";
import {Button} from "@nextui-org/react";
import {fetchData} from "../../../../utils/api";
import {ADD_CRYSTALS, getDispatchObject, SET_USER_ADD_BALANCE} from "../../../../store/reducer";
import {useDispatch} from "react-redux";
import Icon24Done from "../../../../assets/icons/Icon24Done";
import {useTranslation} from "react-i18next";

interface TaskItemProps {
    channel: any
}

const TaskItem: FC<TaskItemProps> = ({ channel }) => {

    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    /*const goToChannel = () => {
        if (channel['channel_address']) {
            getTG().openTelegramLink(`https://t.me/${channel['channel_address'].replace('@', '')}`);
        }

        else if (channel['link']) {
            getTG().openLink(channel['link']);
        }

        setIsLoading(true);
        setTimeout(check, 10000);
    }*/

    const goToChannel = () => {
        try {
            if (channel.link !== null) {
                if (channel.link.includes('https://t.me')) {
                    getTG().openTelegramLink(channel.link);
                } else {
                    getTG().openLink(channel.link);
                }
            } else {
                getTG().openTelegramLink(`https://t.me/${channel['channel_address'].replace('@', '')}`);
            }
        } catch (error) {
            getTG().openLink(channel.link);
        }

        setIsLoading(true);
        setTimeout(check, 10000);
    }

    const check = async () => {
        const response = await fetchData(
            '/tasks/check',
            { id: channel['id'] }
        );

        setIsLoading(false);

        if (response.error) {
            return;
        }

        const result = response.result;
        if (result === 'not subscribed') {
            getTG().showAlert(t("Вы не выполнили задание!!"));
            return;
        }

        if (channel['award']) {
            dispatch(getDispatchObject(SET_USER_ADD_BALANCE, channel['award']));
        }

        if (channel['award_crystals']) {
            dispatch(getDispatchObject(ADD_CRYSTALS, channel['award_crystals']));
        }

        document.dispatchEvent(new Event("TASKS_UPDATE"));
        document.dispatchEvent(new Event("SHOW_DONE_ANIMATION"));
    }

    return (
        <Cell
            title={channel.title}
            after={
                channel.award !== -1 ? (
                    isLoading ? (
                        <Button
                            size="sm"
                            isLoading={true}
                        />
                    ) : (
                        <Button
                            size="sm"
                            onClick={goToChannel}
                        >
                            {t('Начать')}
                        </Button>
                    )
                ) : (
                    <Icon24Done />
                )
            }
            before={
                <EmojiRectangle>
                    <Img src={require(`../../../../assets/images/${getSocialIconByUrl(channel['link'] ?? channel['channel_address'])}`)} />
                </EmojiRectangle>
            }
        >
            {channel.award === -1 ? (
                t("Выполнено")
            ) : (
                <div style={{ gap: 12, display: 'flex' }}>
                    {channel['award_crystals'] && <p>+ {formatNumberWithSpaces(channel['award_crystals'])} 💎</p>}
                    {channel.award && <p style={{ color: 'var(--accent_color)' }}>+ {formatNumberWithSpaces(channel.award)} G</p>}
                </div>
            )}
        </Cell>
    );
};

export default TaskItem;