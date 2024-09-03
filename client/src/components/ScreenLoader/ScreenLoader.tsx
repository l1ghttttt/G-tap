import React, {FC, useEffect} from 'react';
import './ScreenLoader.css';
import {Button, Spinner} from '@nextui-org/react';
import BottomLayout from "../BottomLayout/BottomLayout";
import Div from "../Div/Div";
import Spacing from "../Spacing/Spacing";
import {useTranslation} from "react-i18next";
import Img from "../Img/Img";
import {DefaultStateType, getDispatchObject, SET_LANG, SET_SCREEN_POPUP} from "../../store/reducer";
import {useDispatch, useSelector} from "react-redux";
import i18next from "i18next";

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

// todo
interface ScreenLoaderProps {
    content: null | 'loading' | 'screenLoading' | 'screenLoadingPayment'
}

const ScreenLoader: FC<ScreenLoaderProps> = ({ content }) => {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const closePopup = () => {
        dispatch(getDispatchObject(SET_SCREEN_POPUP, null));
    }

    return (
        content && (
            <>
                {content === 'screenLoading' && (
                    <div className= {`ScreenLoader--container ScreenLoader--filled ${ i18next.language == 'en' ?  'ScreenLoader--bg-image-eng' : 'ScreenLoader--bg-image'}  `}>


                        <div className={`lang-buttons`}>
                            {
                                i18next.language == 'en' ? <button className={`lang-btn`} onClick= {() => i18next.changeLanguage('ru')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30" width="30" height="18"
                                     className={`country-flag`}>
                                    <clipPath id="t">
                                        <path d="M25,15h25v15zv15h-25zh-25v-15zv-15h25z"/>
                                    </clipPath>
                                    <path d="M0,0v30h50v-30z" fill="#012169"/>
                                    <path d="M0,0 50,30M50,0 0,30" stroke="#fff" strokeWidth="6"/>
                                    <path d="M0,0 50,30M50,0 0,30" clipPath="url(#t)" stroke="#C8102E"
                                          strokeWidth="4"/>
                                    <path d="M-1 11h22v-12h8v12h22v8h-22v12h-8v-12h-22z" fill="#C8102E" stroke="#FFF"
                                          strokeWidth="2"/>
                                </svg>
                                EN
                            </button> : <button className={`lang-btn`} onClick={() => i18next.changeLanguage('en')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" width="30" height="18"
                                     className={`country-flag`}>
                                    <rect fill="#fff" width="9" height="3"/>
                                    <rect fill="#d52b1e" y="3" width="9" height="3"/>
                                    <rect fill="#0039a6" y="2" width="9" height="2"/>
                                </svg>
                                RU
                            </button>
                            }


                        </div>
                        <div className="ScreenLoader--content">
                            {/*<Spinner size="lg" color="default"/>*/}
                        </div>

                        <BottomLayout>
                            <Div>
                                <Button
                                    size="lg"
                                    fullWidth
                                    onClick={closePopup}
                                >
                                    {t('Продолжить')}
                                </Button>
                            </Div>

                            <Spacing/>
                        </BottomLayout>
                    </div>
                )}

                {content === 'screenLoadingPayment' && (
                    <div className="ScreenLoader--container ScreenLoader--filled">
                        <div className="ScreenLoader--content">
                            <Spinner size="lg" color="default"/>
                            <Spacing/>

                            <Div>
                                <p>{t('global__payment_waiting_title')}</p>
                            </Div>
                        </div>
                    </div>
                    )}

                {content === 'loading' && (
                    <div className="ScreenLoader--container ScreenLoader--transparent">
                        <div className="ScreenLoader--content">
                            <div className="ScreenLoader--loader-layout">
                               <Spinner size="lg" color="default"/>
                           </div>
                        </div>
                    </div>
                )}
            </>
        )
    );
};

export default ScreenLoader;