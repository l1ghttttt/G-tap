import React, {FC} from 'react';
import './NameBlock.css';
import {getTG} from "../../../../utils/utils";
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../../../store/reducer";
import Img from "../../../../components/Img/Img";
import {getImageUrl, getTelegramImageUrl} from "../../../../utils/api";

interface NameBlockProps {
    name: string
}

const NameBlock: FC<NameBlockProps> = ({ name }) => {

    const user = useSelector((selector: DefaultStateType) => selector.user);

    name = name ?? "player";
    console.log(name)

    return (
        <div className="NameBlock--container">
            {user !== null && user.photo !== null ? (
                <Img src={getTelegramImageUrl(user.photo)} />
            ) : (
                <div className="NameBlock--image">
                    {name[0]}
                </div>
            )}

            <p>{name}</p>
        </div>
    );
};

export default NameBlock;