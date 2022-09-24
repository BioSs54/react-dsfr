import { isBrowser } from "./tools/isBrowser";
import type { ColorScheme } from "./colorScheme";
import {
    startObservingColorSchemeHtmlAttribute,
    data_fr_theme,
    data_fr_scheme
} from "./colorScheme";
import { assert } from "tsafe/assert";
import { symToStr } from "tsafe/symToStr";

export type Params = {
    defaultColorScheme: ColorScheme | "system";
    /** Default: false */
    verbose?: boolean;
};

let isStarted = false;

export async function startReactDsfr(params: Params) {
    const { defaultColorScheme, verbose = false } = params;

    assert(
        isBrowser,
        [
            `${symToStr({ startReactDsfr })}() is not supposed`,
            `to be run on the backed, only in the browser`
        ].join(" ")
    );

    assert(!isStarted, `${symToStr({ startReactDsfr })}() should be called only once`);

    isStarted = true;

    const global: any = window;

    document.documentElement.setAttribute(data_fr_scheme, defaultColorScheme);

    const isNextJsDevMode = global.__NEXT_DATA__?.buildId === "development";

    hack_html_attribute_supposed_to_be_set_by_js: {
        if (isNextJsDevMode) {
            // NOTE: Or else we get an hydration error.
            break hack_html_attribute_supposed_to_be_set_by_js;
        }

        document.documentElement.setAttribute(
            data_fr_theme,
            (() => {
                const colorSchemeReadFromLocalStorage = localStorage.getItem("scheme");

                const colorSchemeOrSystem: ColorScheme | "system" =
                    (() => {
                        switch (colorSchemeReadFromLocalStorage) {
                            case "light":
                            case "dark":
                            case "system":
                                return colorSchemeReadFromLocalStorage;
                            default:
                                return null;
                        }
                    })() ?? defaultColorScheme;

                return colorSchemeOrSystem !== "system"
                    ? colorSchemeOrSystem
                    : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            })()
        );
    }

    startObservingColorSchemeHtmlAttribute();

    global.dsfr = { verbose, "mode": "manual" };

    await import("@gouvfr/dsfr/dist/dsfr.module");

    if (isNextJsDevMode) {
        console.log(
            [
                "Artificial delay to avoid the",
                "'Hydration failed because the initial UI does not match what was rendered on the server.'",
                "Error. In production mode the white flash wont be that long."
            ].join(" ")
        );
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    global.dsfr.start();
}
