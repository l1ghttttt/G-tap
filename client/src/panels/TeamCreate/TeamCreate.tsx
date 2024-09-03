import React, {FC, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Placeholder from "../../components/Placeholder/Placeholder";
import Spacing from "../../components/Spacing/Spacing";
import {Button, Input} from "@nextui-org/react";
import Div from "../../components/Div/Div";
import {ROUTE_CREATE_TEAM, ROUTE_TEAM} from "../../routes";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import {useDispatch, useSelector} from "react-redux";
import {DefaultStateType, getDispatchObject, SET_TEAM} from "../../store/reducer";
import {fetchDataAxios} from "../../utils/api";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {teamFormChange} from "../../utils/inputValidator";

const TeamCreate: FC = ({}) => {

    const [file, setFile] = useState<any>(null);
    const [nameInput, setNameInput] = useState("");
    const [linkInput, setLinkInput] = useState("");

    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const create = async () => {
        // @ts-ignore
        const tg = window['Telegram'].WebApp;

        if (nameInput.length < 2) {
            tg.showAlert(t('teamCreateMinimumLengthError'));
            return;
        }

        const linkRegex = /^(?:https?:\/\/)?(?:\w+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/;
        if (!linkRegex.test(linkInput) && linkInput.length > 0) {
            tg.showAlert(t('teamCreateInvalidLinkError'));
            return;
        }

        const result = await fetchDataAxios('/team/create', {
            file,
            teamName: nameInput,
            link: linkInput || null,
        });

        if (result.error) {
            console.error(result.error);
            tg.showAlert('Server error, try again');
            return;
        }

        dispatch(getDispatchObject(SET_TEAM, result.result));
        navigate(ROUTE_TEAM, {replace: true});

        console.log(result)
    }

    return (
        <Panel>
            <TelegramBackButton />

            <Placeholder
                title={t("Создать сквад")}
            />

            <Spacing size={24} />

            <>
                <Input
                    size="sm"
                    label="Name"
                    value={nameInput}
                    onChange={(event) => teamFormChange("name", event, setNameInput)}
                />

                <Spacing />

                <Input
                    size="sm"
                    label="Link"
                    value={linkInput}
                    onChange={(event) => teamFormChange("link", event, setLinkInput)}
                />
            </>

            <BottomLayout>
                <Div>
                    <Button
                        size="lg"
                        color="primary"
                        onClick={create}
                        fullWidth
                    >
                        {t('Создать')}
                    </Button>
                </Div>
                <Spacing />
            </BottomLayout>
        </Panel>
    );
};

export default TeamCreate;