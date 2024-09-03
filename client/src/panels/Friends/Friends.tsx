import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import Div from "../../components/Div/Div";
import DropGameBanner from "../Home/components/DropGameBanner/DropGameBanner";
import Spacing from "../../components/Spacing/Spacing";
import CoinsButton from "../Home/components/CoinsButton/CoinsButton";
import TabBar from "../../components/TabBar/TabBar";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import Pattern from "../../components/Pattern/Pattern";
import Placeholder from "../../components/Placeholder/Placeholder";
import Icon28NewUser from "../../assets/icons/Icon28NewUser";
import {Button, Popover, PopoverContent, PopoverTrigger, Spinner} from "@nextui-org/react";
import {fetchData} from "../../utils/api";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import TotalEarnings from "./components/TotalEarnings/TotalEarnings";
import {enqueueSnackbar} from "notistack";
import {copyText, getTG} from "../../utils/utils";
import Icon24Info from "../../assets/icons/Icon24Info";
import Icon28Home from "../../assets/icons/Icon28Home";
import Icon28Copy from "../../assets/icons/Icon28Copy";
import Container from "../../components/Container/Container";
import {useTranslation} from "react-i18next";

interface FriendsProps {

}

const Friends: FC<FriendsProps> = ({}) => {

    const {t} = useTranslation();
    const [friends, setFriends] = useState<any>(null);
    const [friendsCount, setFriendsCount] = useState<any>(0);
    const [totalEarnings, setTotalEarnings] = useState<any>(0);

    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        fetchFriends().then();
    }, []);

    const fetchFriends = async () => {
        setPageLoading(true);

        const response = await fetchData('/user/getFriends');

        if (response.error) {
            return;
        }

        setPageLoading(false);

        const data = response.result;
        setFriends(data['friends']['list']);
        setFriendsCount(data['friends']['count']);
        setTotalEarnings(data['totalEarnings']);
    }

    const invite = () => {
        getTG().openTelegramLink(
            `https://t.me/share/url?url=${`${process.env.REACT_APP_TELEGRAM_BOT_URL}?start=r_${getTG().initDataUnsafe.user.id}`}`
        );
    }

    const copyLink = () => {
        copyText(`${process.env.REACT_APP_TELEGRAM_BOT_URL}?start=r_${getTG().initDataUnsafe.user.id}`)
        enqueueSnackbar(t('Ссылка скопирована'))
    }



    return (
        <Panel>
            {friends !== null && !pageLoading ? (
                <>
                    <Pattern />

                    <>
                        <Spacing size={friends.length > 0 ? 16 : '25vh'} />

                        <Placeholder
                            title={t("Приглашайте друзей")}
                            text={t("и получайте 1 💎, 5% от заработка ваших друзей и 1% от заработка их друзей")}
                        >
                            <Icon28NewUser />
                        </Placeholder>

                        {friends.length > 0 && (
                            <>
                                <Spacing size={32} />
                                <TotalEarnings sum={totalEarnings} />

                                <Spacing size={32} />
                                <Container title={`${friendsCount} ${t('друзей')}`}>
                                    <CellContainer>
                                        {friends.map((friend: any) => (
                                            <Cell
                                                key={friend['telegram_id']}
                                                title={`@${friend.username}`}
                                                before={
                                                    <EmojiRectangle>
                                                        <Icon28NewUser />
                                                    </EmojiRectangle>
                                                }
                                                after={
                                                    <p>+ {friend['inviter_earnings']} <span style={{ color: 'var(--gray_text_color)' }}>G</span></p>
                                                }
                                            >
                                                {friend['friendsCount']} {t('друзей')}
                                            </Cell>
                                        ))}
                                    </CellContainer>
                                </Container>

                                <Spacing size={200} />
                            </>
                        )}
                    </>
                </>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <Spinner style={{ marginTop: '35vh' }} />
                </div>
            )}

            <BottomLayout>
                <Div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Button
                            size="lg"
                            color="primary"
                            fullWidth
                            onClick={invite}
                        >
                            {t('Пригласить друзей')}
                        </Button>

                        <Button
                            size="lg"
                            color="secondary"
                            fullWidth
                            isIconOnly
                            onClick={copyLink}
                        >
                            <Icon28Copy />
                        </Button>
                    </div>
                </Div>

                <Spacing />
                <TabBar />
            </BottomLayout>
        </Panel>
    );
};

export default Friends;