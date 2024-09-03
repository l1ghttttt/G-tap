import React, {FC} from 'react';
import './HomeBackground.css';
import Img from "../../../../components/Img/Img";

interface HomeBackgroundProps {

}

const HomeBackground: FC<HomeBackgroundProps> = ({}) => {
    return (
        <div className="HomeBackground">
            <Img src={require('../../../../assets/images/coin.png')} />
        </div>
    );
};

export default HomeBackground;