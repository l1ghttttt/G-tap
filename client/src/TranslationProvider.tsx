import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // импортируйте настройки i18next

interface TranslationProviderProps {
    children: ReactNode;
}

const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
};

export default TranslationProvider;