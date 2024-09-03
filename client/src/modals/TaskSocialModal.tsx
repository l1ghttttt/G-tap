import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/react';
import React, {FC} from 'react';
import useModal from "../hooks/useModal";
import {useTranslation} from "react-i18next";
import {fetchData} from "../utils/api";
import {useDispatch} from "react-redux";
import {getDispatchObject, SET_USER_ADD_BALANCE} from "../store/reducer";
import {MODAL_TASK_SOCIAL} from "../routes";

// @ts-ignore
const tg = window['Telegram'].WebApp;

const TaskSocialModal: FC = ({}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {activeModal, setActiveModal, activeModalParams} = useModal();

    const goToChannel = () => {
        if (activeModalParams['channel_address']) {
            tg.openTelegramLink(`https://t.me/${activeModalParams['channel_address'].replace('@', '')}`);
            return;
        }

        if (activeModalParams['link']) {
            tg.openLink(activeModalParams['link']);
        }
    }

    const check = async (onClose: () => void) => {
        const response = await fetchData(
            '/tasks/check',
            { id: activeModalParams['id'] }
        );

        if (response.error) {
            return;
        }

        const result = response.result;
        if (result === 'not subscribed') {
            tg.showAlert(t("Вы не выполнили задание!"));
            return;
        }

        dispatch(getDispatchObject(SET_USER_ADD_BALANCE, activeModalParams['award']));

        document.dispatchEvent(new Event("TASKS_UPDATE"));
        document.dispatchEvent(new Event("SHOW_DONE_ANIMATION"));

        onClose();
    }

    return (
        <Modal
            isOpen={activeModal === MODAL_TASK_SOCIAL}
            placement='bottom'
            onClose={() => setActiveModal(null)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{activeModalParams.title}</ModalHeader>
                        <ModalBody>
                            <p className="text-16-medium">
                                {activeModalParams['channel_address'] ? t("Чтобы получить вознаграждение за выполнение задания, вам необходимо присоединиться к каналу и нажать на кнопку проверки задания.") : t("Чтобы получить вознаграждение за выполнение задания, вам нужно перейти по ссылке и выполнить задание, а затем нажать на кнопку проверки задания.")}
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <div style={{ display: 'block', width: '100%' }}>
                                <Button
                                    size="lg"
                                    fullWidth
                                    color="primary"
                                    onClick={goToChannel}
                                >
                                    {activeModalParams['channel_address'] ? t("Перейти") : t("Перейти")}
                                </Button>
                                <Button
                                    style={{ marginTop: 8 }}
                                    fullWidth
                                    color="primary"
                                    variant="light"
                                    onClick={() => check(onClose)}
                                >
                                    {t('Проверить задания')}
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default TaskSocialModal;