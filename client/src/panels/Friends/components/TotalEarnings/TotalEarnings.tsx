import React, {FC} from 'react';
import './TotalEarnings.css';
import {formatNumberWithSpaces} from "../../../../utils/numbers";
import {useTranslation} from "react-i18next";

interface TotalEarningsProps {
    sum: number
}

const TotalEarnings: FC<TotalEarningsProps> = ({ sum }) => {

    const {t} = useTranslation();

    return (
        <div className="TotalEarnings--container">
            <h3>{formatNumberWithSpaces(sum)} G</h3>
            <p>{t('всего заработано')}</p>
        </div>
    );
};

export default TotalEarnings;