import React, {FC} from 'react';
import './Score.css';
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../../../store/reducer";
import {formatNumberWithSpaces} from "../../../../utils/numbers";
import Spacing from "../../../../components/Spacing/Spacing";

interface ScoreProps {

}

const Score: FC<ScoreProps> = ({}) => {

    const user = useSelector((selector: DefaultStateType) => selector.user);

    return (
        <div className="Score--container">
            <h1><span>G</span> {user === null ? 0 : formatNumberWithSpaces(user.balance)}</h1>

            <Spacing size={10} />

            <p>💎 {formatNumberWithSpaces(user?.crystals ?? 0)}</p>
        </div>
    );
};

export default Score;