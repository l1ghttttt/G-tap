import React, {FC, ReactNode} from 'react';
import './TeamHeader.css';
import Icon16Chevron from "../../../../assets/icons/Icon16Chevron";

// @ts-ignore
const tg = window['Telegram'].WebApp;

interface TeamHeaderProps {
    image?: ReactNode
    name: string
    link?: string
}

const TeamHeader: FC<TeamHeaderProps> = ({image, name, link }) => {

    const openLink = () => {
        if (!link) {
            return;
        }

        tg.openLink(link);
    }

    return (
        <div className="TeamHeader--container">
            <div
                className="TeamHeader--title"
                onClick={openLink}
                style={{
                    cursor: link ? 'pointer' : 'default'
                }}
            >
                <h1>{name}</h1>

                {/*{link && (
                    <Icon16Chevron />
                )}*/}
            </div>
        </div>
    );
};

export default TeamHeader;