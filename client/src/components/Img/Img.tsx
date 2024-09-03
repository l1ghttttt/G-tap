import React, {FC} from 'react';

interface ImgProps {
    radius?: number
}

const Img: FC<ImgProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>> = (props) => {
    return (
        <img
            {...props}
            alt=""
            style={{ ...props.style }}
        />
    );
};

export default Img;