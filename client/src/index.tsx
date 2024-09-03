import ReactDOM from "react-dom";
import App from "./App";
import {Provider} from "react-redux";
import store from "./store/store";
import './css/style.css';
import {WebAppProvider} from "@vkruglikov/react-telegram-web-app";
import {NextUIProvider} from "@nextui-org/react";
import './i18n';
//import './eruda';
import './firebase';
import ErrorBoundary from "./components/ErrorBoundary";
import './utils/touch';
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import {MaterialDesignContent, SnackbarProvider} from "notistack";
import styled from "@emotion/styled";

// @ts-ignore
const tg = window['Telegram']['WebApp'];
console.log(tg)

tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');
tg.enableClosingConfirmation();
tg.ready();
tg.expand();


// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <WebAppProvider options={{ smoothButtonsTransition: false }}>
            <NextUIProvider>
                <main className="dark text-foreground">
                    <ErrorBoundary>
                        <SnackbarProvider
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            Components={{
                                default: styled(MaterialDesignContent)(() => ({
                                    '&.notistack-MuiContent-default': {
                                        backgroundColor: 'var(--gray_text_color)',
                                        borderRadius: 16,
                                    },
                                }))
                            }}
                        >
                            <App />
                        </SnackbarProvider>
                    </ErrorBoundary>
                </main>
            </NextUIProvider>
        </WebAppProvider>
    </Provider>
);

// 11h