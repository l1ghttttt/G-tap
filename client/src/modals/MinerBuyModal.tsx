import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/react';
import React, {FC} from 'react';
import { MODAL_MINER_BUY} from "../routes";
import useModal from "../hooks/useModal";
import {fetchData} from "../utils/api";
import {useDispatch, useSelector} from "react-redux";
import {DefaultStateType, getDispatchObject, REDUCE_BALANCE, SET_MINER_EARNINGS} from "../store/reducer";
import Placeholder from "../components/Placeholder/Placeholder";
import Spacing from "../components/Spacing/Spacing";
import Img from "../components/Img/Img";
import {formatNumberWithSpaces} from "../utils/numbers";
import {useTranslation} from "react-i18next";

// @ts-ignore
const tg = window['Telegram'].WebApp;

const MinerBuyModal: FC = ({}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const selector = useSelector((selector: DefaultStateType) => selector);

    const {activeModal, setActiveModal, activeModalParams} = useModal();

    const buy = async (onClose: () => void) => {
        if (selector.user === null) {
            return;
        }

        if (!activeModalParams.nextFriends) {
            if (activeModalParams.category === 'default') {
                if (activeModalParams.nextCost > selector.user.balance) {
                    return;
                }
            } else {
                if (activeModalParams.nextCost > selector.user.crystals) {
                    return;
                }
            }
        }

        const response = await fetchData(
            '/miners/buy',
            { id: activeModalParams.id }
        );

        if (response.error) {
            return;
        }

        dispatch(getDispatchObject(REDUCE_BALANCE, activeModalParams.nextCost));
        dispatch(getDispatchObject(SET_MINER_EARNINGS, selector.user.minersEarnings + activeModalParams['nextEarnings']));

        document.dispatchEvent(new Event("MINERS_UPDATE"));
        document.dispatchEvent(new Event("SHOW_DONE_ANIMATION"));

        onClose();
    }

    const balance = (selector.user?.balance ?? 0);

    return (
        <Modal
            isOpen={activeModal === MODAL_MINER_BUY}
            placement='bottom'
            onClose={() => setActiveModal(null)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className="px-3">
                            <Placeholder
                                title={t("Новое улучшение")}
                                text={`+ ${activeModalParams.nextEarnings}${t('% к прибыли')}`}
                            >
                                <Img src={require(`../assets/images/miners/${activeModalParams.image}`)} />
                            </Placeholder>
                        </ModalBody>

                        <ModalFooter className="px-3">
                            {!activeModalParams.nextFriends ? (
                                <Button
                                    size="lg"
                                    fullWidth
                                    color={balance >= activeModalParams.nextCost ? "primary" : "secondary"}
                                    onClick={() => buy(onClose)}
                                >
                                    {activeModalParams.nextCost > 0 ? (
                                        `${balance >= activeModalParams.nextCost ? `${t("Купить за")} ${formatNumberWithSpaces(activeModalParams.nextCost)} ${activeModalParams.category === 'special' ? '💎' : 'G'}` : t("Недостаточно")}`
                                    ) : (
                                        t("Получить")
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    fullWidth
                                    color="primary"
                                    onClick={() => buy(onClose)}
                                    disabled={activeModalParams.nextFriends - activeModalParams.currentFriends > 0}
                                >
                                    {activeModalParams.nextFriends - activeModalParams.currentFriends > 0 ? (
                                        `${t('Еще')} ${activeModalParams.nextFriends - activeModalParams.currentFriends} ${t("друзей")}`
                                    ) : (
                                        t("Получить")
                                    )}
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default MinerBuyModal;