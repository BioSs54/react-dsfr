import type { ReactNode } from "react";
import { start } from "../start";
import type { RegisterLink, RegisteredLinkProps } from "../link";
import { setLink } from "../link";
import { setUseLang } from "../i18n";
import type { ColorScheme } from "../useIsDark";
import { isBrowser } from "../tools/isBrowser";

export type { RegisterLink, RegisteredLinkProps };

let isAfterFirstEffect = false;
const actions: (() => void)[] = [];

export function startReactDsfr(params: {
    defaultColorScheme: ColorScheme | "system";
    /** Default: false */
    verbose?: boolean;
    /** Default: <a /> */
    Link?: (props: RegisteredLinkProps & { children: ReactNode }) => ReturnType<React.FC>;
    /** Default: ()=> "fr" */
    useLang?: () => string;
}) {
    const { defaultColorScheme, verbose = false, Link, useLang } = params;

    if (Link !== undefined) {
        setLink({ Link });
    }

    if (useLang !== undefined) {
        setUseLang({ useLang });
    }

    if (isBrowser) {
        start({
            defaultColorScheme,
            verbose,
            "nextParams": {
                "doPersistDarkModePreferenceWithCookie": false,
                "registerEffectAction": action => {
                    if (isAfterFirstEffect) {
                        action();
                    } else {
                        actions.push(action);
                    }
                }
            }
        });
    }
}

export function dsfrEffect(): void {
    if (isAfterFirstEffect) {
        return;
    }
    isAfterFirstEffect = true;
    actions.forEach(action => action());
}
