"use client";

import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { isBrowser } from "../tools/isBrowser";
import type { ColorScheme } from "../useIsDark";
import { SsrIsDarkProvider } from "../useIsDark/server";
import { dsfrEffect } from "./start";
import { GdprProvider } from "../gdpr/GdprContext";

export type DsfrProviderProps = {
    defaultColorScheme: ColorScheme | "system";
    children: ReactNode;
};

export function DsfrProvider(props: DsfrProviderProps) {
    const { defaultColorScheme, children } = props;

    useEffect(() => {
        dsfrEffect();
    }, []);

    if (isBrowser) {
        return <>{children}</>;
    }

    const isDark = defaultColorScheme === "dark" ? true : false;

    return (
        <SsrIsDarkProvider value={isDark}>
            <GdprProvider>{children}</GdprProvider>
        </SsrIsDarkProvider>
    );
}
