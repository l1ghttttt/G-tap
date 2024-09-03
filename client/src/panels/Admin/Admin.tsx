import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import Placeholder from "../../components/Placeholder/Placeholder";
import Container from "../../components/Container/Container";
import {Button, Input, Skeleton} from "@nextui-org/react";
import Spacing from "../../components/Spacing/Spacing";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import Icon16Chevron from "../../assets/icons/Icon16Chevron";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../components/Img/Img";
import {fetchData} from "../../utils/api";
import useModal from "../../hooks/useModal";
import {formatNumberWithSpaces} from "../../utils/numbers";
import {MODAL_ADMIN_TASK} from "../../routes";

const Admin: FC = () => {

    const [data, setData] = useState<any>(null);
    const [dataLoading, setDataLoading] = useState(false);

    const {activeModal, setActiveModal, activeModalParams} = useModal();

    useEffect(() => {
        fetch().then();

        createEventListeners();
        return removeEventListeners;
    }, []);

    const fetch = async () => {
        setDataLoading(true);

        const response = await fetchData('/admin/get');
        console.log(response);

        if (response.error) {
            return;
        }

        setData(response.result);
        setDataLoading(false);
    }

    const createEventListeners = () => {
        document.addEventListener("admin_update", fetch);
    }

    const removeEventListeners = () => {
        document.removeEventListener("admin_update", fetch);
    }

    return (
        <Panel>
            <Placeholder title="Admin panel" />
            <Spacing size={32} />

            <Spacing size={24} />

            <Container title="Tasks (social)">
                <CellContainer>
                    {dataLoading && (
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16
                            }}
                        />
                    )}

                    {!dataLoading && data !== null && (
                        <>
                            <Button
                                fullWidth
                                color="primary"
                                onClick={() => setActiveModal(MODAL_ADMIN_TASK)}
                            >
                                Add
                            </Button>

                            <Spacing />

                            {data['tasks']['channels'].map((channel: any, index: number) => (
                                <Cell
                                    key={index}
                                    title={channel['title']}
                                    after={<Icon16Chevron />}
                                    onClick={() => setActiveModal(MODAL_ADMIN_TASK, channel)}
                                    before={
                                        <EmojiRectangle>
                                            <Img src={require('../../assets/images/emoji/loudspeaker.png')} />
                                        </EmojiRectangle>
                                    }
                                >
                                    + ${formatNumberWithSpaces(channel['award'])} G
                                </Cell>
                            ))}
                        </>
                    )}
                </CellContainer>
            </Container>
        </Panel>
    );
};

export default Admin;