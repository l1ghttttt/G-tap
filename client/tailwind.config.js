import {nextui} from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: "class",
    plugins: [nextui({
        prefix: "nextui", // prefix for themes variables
        addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
        defaultTheme: "dark", // default theme from the themes object
        defaultExtendTheme: "dark", // default theme to extend on custom themes
        layout: {
            radius: {
                medium: '16px',
                small: '16px',
            },
        }, // common layout tokens (applied to all themes)
        themes: {
            dark: {
                layout: {}, // dark theme layout tokens
                colors: {
                    content1: {
                        DEFAULT: "#252525",
                    },
                    primary: {
                        DEFAULT: "#532BC0",
                    },
                    success: {
                        DEFAULT: "#2BC043",
                        foreground: '#fff',
                    },
                    secondary: {
                        DEFAULT: "#343042",
                        foreground: "#8D8B9A",
                    },
                    danger: {
                        DEFAULT: "#FF2E2E",
                    },
                    default: {
                        DEFAULT: '#000000',
                        100: '#252525',
                    },
                },
                variants: {

                },
            },
        },
    })],
}

