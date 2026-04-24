"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const orig = console.error;
    console.error = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
            return;
        }
        if (typeof args[0] === 'string' && args[0].includes('inputProps')) {
            console.trace('inputProps warning — find the real culprit:');
        }
        orig.apply(console, args);
    };
}

export default function ThemeProvider({ children, ...props }) {
    return (
        <NextThemesProvider {...props}>
            {children}
        </NextThemesProvider>
    );
}