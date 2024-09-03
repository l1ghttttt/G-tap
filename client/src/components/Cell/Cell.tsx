import {FC, MouseEventHandler, ReactNode} from 'react';
import './Cell.css';

interface CellProps {
    title: string
    before?: ReactNode
    after?: ReactNode
    children?: ReactNode
    titleAfter?: ReactNode
    onClick?: MouseEventHandler<HTMLDivElement>
    size?: 'lg' | 'md'
}

const Cell: FC<CellProps> = (props) => {

    const {size = 'lg'} = props;

    return (
        <div
            className="Cell--container"
            onClick={props.onClick}
            style={{ minHeight: size === 'lg' ? 48 : 24 }}
        >
            {props.before && (
                <div className="Cell--before">
                    {props.before}
                </div>
            )}

            <div className="Cell--content">
                <div className="Cell--title-container">
                    <div className="Cell--title">
                        <p>{props.title}</p>
                    </div>

                    {props.titleAfter && (
                        <div className="Cell--title-after">
                            {props.titleAfter}
                        </div>
                    )}
                </div>

                {props.children && (
                    <div className="Cell--children">
                        {props.children}
                    </div>
                )}
            </div>

            {props.after && (
                <div className="Cell--after">
                    {props.after}
                </div>
            )}
        </div>
    );
};

export default Cell;