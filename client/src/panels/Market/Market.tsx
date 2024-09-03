import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import Pattern from "../../components/Pattern/Pattern";
import Spacing from "../../components/Spacing/Spacing";
import Placeholder from "../../components/Placeholder/Placeholder";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import TabBar from "../../components/TabBar/TabBar";
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../store/reducer";
import useModal from "../../hooks/useModal";
import {fetchData} from "../../utils/api";
import {Spinner, Tab, Tabs} from "@nextui-org/react";
import CardContainer from "../../components/CardContainer/CardContainer";
import MinerCard from "./components/MinerCard/MinerCard";
import Card from "../../components/Card/Card";
import './Market.css';
import {MODAL_MINER_BUY} from "../../routes";
import ScreenDone from "../../components/ScreenDone/ScreenDone";
import {formatNumberWithSpaces} from "../../utils/numbers";
import {useTranslation} from "react-i18next";

interface MarketProps {

}

const Market: FC<MarketProps> = ({}) => {
    const { t } = useTranslation();
    const [miners, setMiners] = useState<any>(null);
    const [showDone, setShowDone] = useState(false);

    const selector = useSelector((s: DefaultStateType) => s);
    const {activeModal, setActiveModal, activeModalParams} = useModal();

    useEffect(() => {
        fetchMiners().then()
        createEventListeners();

        return () => {
            removeEventListeners();
        }
    }, []);

    const createEventListeners = () => {
        document.addEventListener("MINERS_UPDATE", fetchMiners);
        document.addEventListener("SHOW_DONE_ANIMATION", () => {
            showDoneAnimation();
        });
    }

    const removeEventListeners = () => {
        document.removeEventListener("MINERS_UPDATE", fetchMiners);
    }

    const fetchMiners = async () => {
        const response = await fetchData('/miners/get');

        console.log(response.result)
        setMiners(response.result)
    }

    const clickMiner = (miner: any) => {
        /*if (miner.category === 'special' && miner.id === 6) {
            return;
        }*/

        if (miner.need) {
            return;
        }

        if (miner.nextLevel === -1) {
            return;
        }

        setActiveModal(MODAL_MINER_BUY, miner);
    }

    const showDoneAnimation = () => {
        setShowDone(true);
        setTimeout(() => setShowDone(false), 1200);
    }

    return (
        <Panel>
            <Pattern />

            <Placeholder
                title={t("Маркет")}
            />

            <Spacing size={32} />

            {selector.user !== null && (
                <Card>
                    <div className="Market--current-earnings">
                        <p>{selector.user.minersEarnings?.toFixed(2)} %</p>
                        <p className="Market--current-earnings--coins">+ {formatNumberWithSpaces(Math.floor(86400 * ((selector.user.minersEarnings ?? 0) / 100)))} G</p>
                        <span>{t('текущее увеличение прибыли')}</span>
                    </div>
                </Card>
            )}

            <Spacing size={32}/>

            {miners !== null ? (
                <Tabs
                    fullWidth={true}
                    size="lg"
                    color="default"
                >
                    {Object.keys(miners).map((category: string, index: number) => (
                        <Tab
                            key={index}
                            title= {t(`${category}`)}
                            className="px-0"
                        >
                            <CardContainer>
                                {miners[category].map((miner: any) => (
                                    <MinerCard
                                        key={miner.id}
                                        category={category}
                                        nextFriends={miner.nextFriends}
                                        image={miner.image}
                                        nextEarnings={miner.nextEarnings}
                                        nextCost={miner.nextCost}
                                        nextLevel={miner.nextLevel}
                                        currentLevel={miner.currentLevel}
                                        nextEarningsCoins={miner.nextEarningsCoins}
                                        onClick={() => clickMiner({...miner, category})}
                                        //onClick={() => clickMiner(miner)}
                                    />
                                ))}
                            </CardContainer>
                        </Tab>
                    ))}
                </Tabs>
            ) : (
                <div style={{textAlign: 'center'}}>
                    <Spinner style={{marginTop: '35vh'}}/>
                </div>
            )}

            <Spacing size={56} />

            <BottomLayout>
                <TabBar/>
            </BottomLayout>

            {showDone && (
                <ScreenDone />
            )}
        </Panel>
    );
};

export default Market;