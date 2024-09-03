import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/react';
import React, {FC, useEffect, useState} from 'react';
import {MODAL_ADMIN_TASK} from "../routes";
import useModal from "../hooks/useModal";
import {useTranslation} from "react-i18next";
import {fetchData} from "../utils/api";
import Spacing from '../components/Spacing/Spacing';
import Img from "../components/Img/Img";

// @ts-ignore
const tg = window['Telegram'].WebApp;

const AdminTaskModal: FC = ({}) => {

    const [titleInput, setTitleInput] = useState("");
    const [awardInput, setAwardInput] = useState("");
    const [awardCrystalsInput, setCrystalsInput] = useState("");
    const [channelAddressInput, setChannelAddressInput] = useState("");
    const [linkInput, setLinkInput] = useState("");

    const { t } = useTranslation();
    const {activeModal, setActiveModal, activeModalParams} = useModal();

    const deleteTask = async (onClose: () => void) => {
        if (!activeModalParams) {
            return;
        }

        const response = await fetchData(
            '/admin/deleteTask', {id: activeModalParams.id}
        );

        if (response.error) {
            return;
        }

        const event = new Event("admin_update");
        document.dispatchEvent(event);

        onClose();
    }

    const save = async (onClose: () => void) => {
        const award = Number(awardInput);
        const awardCrystals = Number(awardCrystalsInput);

        if (!award || award < 0) {
            tg.showAlert(t('Выберите правильную награду'));
            return;
        }

        if (!awardCrystals || awardCrystals < 0) {
            tg.showAlert(t('выберите правильные кристаллы для награды'));
            return;
        }

        if (titleInput.length < 1 || titleInput.length > 200) {
            tg.showAlert(t('недействительное название'));
            return;
        }

        if (channelAddressInput.length < 1 && linkInput.length < 1) {
            tg.showAlert(t('необходимо указать адрес канала или канала связи'));
            return;
        }

        const params: any = {
            award,
            awardCrystals,
            title: titleInput,
        };

        if (channelAddressInput.length > 0) {
            if (channelAddressInput.length < 2 || channelAddressInput.length > 150) {
                tg.showAlert(t('выберите правильный адрес канала (формат: @channel)'));
                return;
            }

            const channelAddressRegex = /^@[A-Za-z0-9_]+$/
            if (!channelAddressRegex.test(channelAddressInput)) {
                tg.showAlert(t('выберите правильный адрес канала (формат: @channel)'));
                return;
            }

            params.channelAddress = channelAddressInput;
        }

        if (linkInput.length > 0) {
            if (linkInput.length < 2 || linkInput.length > 300) {
                tg.showAlert(t('выберите правильный адрес канала (формат: @channel)'));
                return;
            }

            const linkRegex = /^(?:https?:\/\/)?(?:\w+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/;
            if (!linkRegex.test(linkInput)) {
                tg.showAlert(t('выберите правильную ссылку (формат: https://site.com)'));
                return;
            }

            params.link = linkInput;
        }

        if (activeModalParams) {
            params.id = activeModalParams.id;
        }

        const response = await fetchData(
            '/admin/saveTask', params
        );

        if (response.error) {
            return;
        }

        const event = new Event("admin_update");
        document.dispatchEvent(event);

        onClose();
    }

    useEffect(() => {
        if (activeModalParams) {
            setAwardInput(activeModalParams['award']);
            setChannelAddressInput(activeModalParams['channel_address'] ?? "");
            setLinkInput(activeModalParams['link'] ?? "");
            setTitleInput(activeModalParams['title']);
            setCrystalsInput(activeModalParams['award_crystals']);
        } else {
            setAwardInput("");
            setChannelAddressInput("");
            setLinkInput("");
            setTitleInput("");
            setCrystalsInput("");
        }
    }, [activeModalParams]);

    return (
        <Modal
            isOpen={activeModal === MODAL_ADMIN_TASK}
            placement='top'
            onClose={() => setActiveModal(null)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {activeModalParams ? "Edit task" : "New task"}
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                isRequired
                                size="md"
                                value={titleInput}
                                placeholder="Title"
                                type="text"
                                onChange={(event) => setTitleInput(event.target.value)}
                            />

                            <Input
                                isRequired
                                size="md"
                                value={awardInput}
                                placeholder="Award"
                                type="number"
                                onChange={(event) => setAwardInput(event.target.value)}
                            />

                            <Input
                                isRequired
                                size="md"
                                value={awardCrystalsInput}
                                placeholder="Award crystalls"
                                type="number"
                                onChange={(event) => setCrystalsInput(event.target.value)}
                            />

                            <div>
                                <Input
                                    isRequired
                                    size="md"
                                    value={linkInput}
                                    type="text"
                                    placeholder="Link (format: https://site.com)"
                                    onChange={(event) => setLinkInput(event.target.value)}
                                />
                                <Spacing size={8}/>
                                <p className="text-14-medium text-gray">Not necessary if you specify the channel address below</p>
                            </div>

                            <div>
                                <Input
                                    isRequired
                                    size="md"
                                    value={channelAddressInput}
                                    type="text"
                                    placeholder="Channel (format: @channel)"
                                    onChange={(event) => setChannelAddressInput(event.target.value)}
                                />
                                <Spacing size={8}/>
                                <p className="text-14-medium text-gray">Not necessary if you specify the link above. The bot needs to be added to this channel and
                                    appointed as an administrator!</p>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            {activeModalParams && (
                                <Button
                                    fullWidth
                                    color="danger"
                                    variant="light"
                                    onClick={() => deleteTask(onClose)}
                                >
                                    {t('Удалить')}
                                </Button>
                            )}

                            <Button
                                fullWidth
                                color="primary"
                                onClick={() => save(onClose)}
                            >
                                {t('Сохранить')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AdminTaskModal;