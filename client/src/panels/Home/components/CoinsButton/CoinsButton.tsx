import React, {FC, useEffect, useState} from 'react';
import {Button, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {DefaultStateType, getDispatchObject, SET_USER_ADD_BALANCE, SET_USER_EARNINGS_GET_LAST_TIME} from "../../../../store/reducer";
import {getTG, getUnixTime} from "../../../../utils/utils";
import {fetchData} from "../../../../utils/api";
import {formatNumberWithSpaces} from "../../../../utils/numbers";
import Confetti from "react-confetti-boom";
import AnimatedNumbers from "react-animated-numbers"
import Countdown from "react-countdown";
import {enqueueSnackbar} from "notistack";
import Icon22LockFilled from "../../../../assets/icons/Icon22LockFilled";

const STATE_CLAIM = {
    state: 'claim',
    button: {
        color: 'success',
        text: 'Claim G 57.600',
    },
};

interface CoinsButtonProps {

}

let intervalId: any;

const CoinsButton: FC<CoinsButtonProps> = ({}) => {

    const [buttonLoading, setButtonLoading] = useState(false);

    const [state, setState] = useState<any>(null);
    const [currentEarnings, setCurrentEarnings] = useState(0);

    const [isShowConfetti, setIsShowConfetti] = useState(false);

    const user = useSelector((selector: DefaultStateType) => selector.user);
    const team = useSelector((selector: DefaultStateType) => selector.team);
    const dispatch = useDispatch();

    useEffect(() => {
        setState(getState());
    }, [user]);

    const getState = () => {
        if (user === null) {
            return null;
        }

        if (user.earningsGetLastTime === null) {
            return {
                state: 'start',
                button: {
                    color: 'primary',
                    text: 'Start farming',
                },
            };
        }

        if (user.earningsGetLastTime + user.earningsDelayTime < getUnixTime()) {
            return STATE_CLAIM;
        }

        return {
            state: 'farming',
            button: {
                color: 'secondary',
                text: 'Farming G 0.100',
            },
        };
    }

    useEffect(() => {
        if (state !== null) {
            if (state.state === 'farming') {
                intervalId = setInterval(interval, 1000);
            } else if (intervalId) {
                clearInterval(intervalId);
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [state]);

    const click = async () => {
        setButtonLoading(true);

        switch (state.state) {
            case 'start': {
                const response = await fetchData('/user/earnings/start');
                dispatch(getDispatchObject(SET_USER_EARNINGS_GET_LAST_TIME, response.result['earningsGetLastTime']));

                break;
            }

            case 'claim': {
                const response = await fetchData('/user/earnings/get');

                showConfetti();
                enqueueSnackbar(`+ ${formatNumberWithSpaces(response.result['earning'])} G`)

                dispatch(getDispatchObject(SET_USER_EARNINGS_GET_LAST_TIME, null));
                dispatch(getDispatchObject(SET_USER_ADD_BALANCE, response.result['earning']));

                break;
            }
        }

        setButtonLoading(false);
        getTG().HapticFeedback.notificationOccurred('success');
    }

    const showConfetti = () => {
        setIsShowConfetti(true);
        setTimeout(() => setIsShowConfetti(false), 10000);
    }

    const interval = () => {
        //console.log(12)
        setTimeLeft(calculateTimeLeft());
        setCurrentEarnings((prev) => calculateCurrentEarnings(prev));
    }

    const calculateCurrentEarnings = (ce: number) => {
        if (user === null) {
            return 0;
        }

        const difference = (user.earningsGetLastTime + user.earningsDelayTime) - Math.floor(Date.now() / 1000);

        if (difference <= 0) {
            clearInterval(intervalId);

            if (state.state === 'claim') {
                return ce;
            }

            setState(STATE_CLAIM);
            return ce;
        }

        const percent = (user.earningsDelayTime - difference) / user.earningsDelayTime;
        return user.earningsPerTime * percent;
    }

    const calculateTimeLeft = () => {
        if (user === null) {
            return;
        }

        const difference = (user.earningsGetLastTime + user.earningsDelayTime) - Math.floor(Date.now() / 1000);
        if (difference > 0) {
            const hours = Math.floor(difference / 3600);
            const minutes = Math.floor((difference % 3600) / 60);
            return { hours, minutes };
        }
        return { hours: 0, minutes: 0 };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    return (
        <>
            {isShowConfetti && (
                <Confetti
                    mode="boom"
                    y={0.2}
                    particleCount={400}
                    spreadDeg={100}
                    colors={['#6338da', '#c637d0', '#d0b137']}
                />
            )}

            {(true) ? (
                <Button
                    size="lg"
                    fullWidth
                    color={state?.button.color}
                    disabled={state?.state === 'farming'}
                    onClick={click}
                    isLoading={buttonLoading}
                    endContent={
                        state?.state === 'farming' && (
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 16,
                                    fontSize: 14,
                                }}
                            >
                                {timeLeft?.hours}h {timeLeft?.minutes}m
                            </div>
                        )
                    }
                >
                    {state?.state === 'farming' && (
                        <>Farming G {formatNumberWithSpaces(currentEarnings)}</>
                    )}

                    {state?.state === 'claim' && (
                        <>Claim G {formatNumberWithSpaces(user?.earningsPerTime ?? 0)}</>
                    )}

                    {state?.state === 'start' && (
                        <>Start farming</>
                    )}
                </Button>
            ) : (
                <Button
                    size="lg"
                    fullWidth
                    color="secondary"
                    startContent={<Icon22LockFilled />}
                    disabled={true}
                >
                    Join the squade
                </Button>
            )}
        </>
    );
};

export default CoinsButton;