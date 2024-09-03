import React, {FC} from 'react';
import './ChannelBlock.css';
import Img from "../../../../components/Img/Img";
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../../../store/reducer";
import {getTG} from "../../../../utils/utils";
import {useTranslation} from "react-i18next";

interface ChannelBlockProps {

}

const ChannelBlock: FC<ChannelBlockProps> = ({}) => {
    const {t} = useTranslation();
    const app = useSelector((selector: DefaultStateType) => selector.app);

    const open = () => {
        if (app === null) {
            return;
        }

        getTG().openTelegramLink(app.telegramChannel.link);
    }

    return (
        app !== null && (
            <div
                className="ChannelBlock--container"
                onClick={open}
            >
                <div className="ChannelBlock--image">
                    <Img src={require('../../../../assets/images/social/telegram.png')}/>
                </div>

                <div className="ChannelBlock--content">
                    <p className="ChannelBlock--content--username">{app.telegramChannel.address}</p>
                    <p className="ChannelBlock--content--text">{t("Telegram канал")}</p>
                </div>
            </div>
        )
    );
};

export default ChannelBlock;