import React, {FC} from 'react';
import './ScreenDone.css';
import Icon24Done from "../../assets/icons/Icon24Done";

interface ScreenDoneProps {

}

const ScreenDone: FC<ScreenDoneProps> = ({}) => {
    return (
        <div className="ScreenDone--container">
            <div className="ScreenDone--rectangle">
                <Icon24Done />
            </div>
        </div>
    );
};

export default ScreenDone;