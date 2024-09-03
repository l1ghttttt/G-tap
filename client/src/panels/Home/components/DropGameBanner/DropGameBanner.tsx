import React, {FC} from 'react';
import './DropGameBanner.css';
import {useTranslation} from "react-i18next";

interface DropGameBannerProps {

}

const DropGameBanner: FC<DropGameBannerProps> = ({}) => {

    const { t } = useTranslation();


    return (
        <div className="DropGameBanner--container">
            <h3>{t('ПОКУПКА БИЛЕТОВ')}</h3>
            <p>{t('Скоро')}</p>
        </div>
    );
};

export default DropGameBanner;