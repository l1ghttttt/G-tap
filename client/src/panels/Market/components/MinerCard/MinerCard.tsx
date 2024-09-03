import React, {FC} from 'react';
import './MinerCard.css';
import Card from "../../../../components/Card/Card";
import {formatNumberShort, formatNumberWithSpaces} from "../../../../utils/numbers";
import Img from "../../../../components/Img/Img";
import {useTranslation} from "react-i18next";

interface MinerCardProps {
    category?: string
    image: string
    nextFriends?: any
    nextEarnings: number
    nextCost: number
    currentLevel: number
    nextLevel: number
    nextEarningsCoins: number
    onClick?: any
}


const MinerCard: FC<MinerCardProps> = ({ category, image, nextLevel, nextFriends, nextEarnings, nextCost, currentLevel, nextEarningsCoins, onClick }) => {

    const { t } = useTranslation();
    return (
        <Card onClick={onClick}>
            <Img
                src={require(`../../../../assets/images/miners/${image}`)}
                style={currentLevel < 1 ? {filter: 'grayscale(100%)'} : undefined}
            />
            <div className={`MinerCard--container MinerCard--category-${category}`}>
                <div className="MinerCard--image">

                </div>

                <div className="MinerCard--info">
                    <div className="MinerCard--info--left">
                        <p
                            className="MinerCard--info--text"
                            style={{ color: currentLevel === 0 ? 'var(--gray_text_color)' : "#fff" }}
                        >
                            {nextLevel !== -1 ? (
                                !nextFriends ? (
                                    `${formatNumberShort(nextCost)} ${category === 'special' ? '💎' : 'G'}`
                                ) : (
                                    `${nextFriends} ${t('друзей')}`
                                )
                            ) : (
                                `${t('Макс.')}`
                            )}
                        </p>

                        <p className="MinerCard--info--description">
                            {t('Цена')} ({currentLevel} {t('ур.')})
                        </p>
                    </div>

                    <div className="MinerCard--info--divider" />

                    <div className="MinerCard--info--right">
                        <p className="MinerCard--info--text">
                            {nextEarnings} %
                        </p>

                        <p className="MinerCard--info--description">
                            <p>+ {formatNumberWithSpaces(nextEarningsCoins)} G</p>
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MinerCard;