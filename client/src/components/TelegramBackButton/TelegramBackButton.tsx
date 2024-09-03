import React, {FC} from 'react';
import {BackButton} from "@vkruglikov/react-telegram-web-app";
import {useNavigate} from "react-router-dom";

const TelegramBackButton: FC = () => {

    const navigate = useNavigate();

    return (
        <BackButton
            onClick={() => navigate(-1)}
        />
    );
};

export default TelegramBackButton;