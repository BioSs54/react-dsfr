import React from "react";
import { objectKeys } from "tsafe/objectKeys";
//import { getColors } from "./lib/colors";
import type { ColorScheme } from "../useIsDark";
import { getAssetUrl } from "../tools/getAssetUrl";
//import { rootColorSchemeStyleTagId } from "./lib/darkMode";

import marianneLightWoff2Url from "../dsfr/fonts/Marianne-Light.woff2";
import marianneItalicWoff2Url from "../dsfr/fonts/Marianne-Light_Italic.woff2";
import marianneRegularWoff2Url from "../dsfr/fonts/Marianne-Regular.woff2";
import marianneRegularItalicWoff2Url from "../dsfr/fonts/Marianne-Regular_Italic.woff2";
import marianneMediumWoff2Url from "../dsfr/fonts/Marianne-Medium.woff2";
import marianneMediumItalicWoff2Url from "../dsfr/fonts/Marianne-Medium_Italic.woff2";
import marianneBoldWoff2Url from "../dsfr/fonts/Marianne-Bold.woff2";
import marianneBoldItalicWoff2Url from "../dsfr/fonts/Marianne-Bold_Italic.woff2";
import spectralRegularWoff2Url from "../dsfr/fonts/Spectral-Regular.woff2";
import spectralExtraBoldWoff2Url from "../dsfr/fonts/Spectral-ExtraBold.woff2";
import AppleTouchIcon from "../dsfr/favicon/apple-touch-icon.png";
import FaviconSvg from "../dsfr/favicon/favicon.svg";
import FaviconIco from "../dsfr/favicon/favicon.ico";
import { data_fr_scheme, data_fr_theme, rootColorSchemeStyleTagId } from "../useIsDark/constants";
import { getColors } from "../fr/colors";
import "../dsfr/dsfr.css";
import "../dsfr/utility/icons/icons.css";

const fontUrlByFileBasename = {
    "Marianne-Light": marianneLightWoff2Url,
    "Marianne-Light_Italic": marianneItalicWoff2Url,
    "Marianne-Regular": marianneRegularWoff2Url,
    "Marianne-Regular_Italic": marianneRegularItalicWoff2Url,
    "Marianne-Medium": marianneMediumWoff2Url,
    "Marianne-Medium_Italic": marianneMediumItalicWoff2Url,
    "Marianne-Bold": marianneBoldWoff2Url,
    "Marianne-Bold_Italic": marianneBoldItalicWoff2Url,
    "Spectral-Regular": spectralRegularWoff2Url,
    "Spectral-ExtraBold": spectralExtraBoldWoff2Url
} as const;

export type DsfrHeadProps = {
    defaultColorScheme: ColorScheme | "system";
    /** If not provided no fonts are preloaded.
     * Preloading of fonts is only enabled in production.
     */
    preloadFonts?: (keyof typeof fontUrlByFileBasename)[];
};

const isProduction = process.env.NODE_ENV !== "development";

export function DsfrHead(props: DsfrHeadProps) {
    const { defaultColorScheme, preloadFonts = [] } = props;

    return (
        <>
            {isProduction &&
                objectKeys(fontUrlByFileBasename)
                    .filter(fileBasename => preloadFonts.includes(fileBasename))
                    .map(fileBasename => fontUrlByFileBasename[fileBasename])
                    .map(url => (
                        <link
                            key={url}
                            rel="preload"
                            href={url}
                            as="font"
                            crossOrigin="anonymous"
                        />
                    ))}
            <link rel="apple-touch-icon" href={getAssetUrl(AppleTouchIcon)} />
            <link rel="icon" href={getAssetUrl(FaviconSvg)} type="image/svg+xml" />
            <link rel="shortcut icon" href={getAssetUrl(FaviconIco)} type="image/x-icon" />
            {isProduction && (
                <script
                    dangerouslySetInnerHTML={{
                        "__html": `

                            window.ssrWasPerformedWithIsDark = "${defaultColorScheme}" === "dark";
                            
                            const isDark = (() => {
                            
                            	const isDarkExplicitlyProvidedAsParameter = (() => {
                            		if ("${defaultColorScheme}" === "system") {
                            			return undefined;
                            		}
                            
                            		switch ("${defaultColorScheme}") {
                            			case "dark": return true;
                            			case "light": return false;
                            		}
                            	})();
                            
                            	const isDarkFromLocalStorage = (() => {
                            		const colorSchemeReadFromLocalStorage = localStorage.getItem("scheme");
                            
                            		if (colorSchemeReadFromLocalStorage === null) {
                            			return undefined;
                            		}
                            
                            		if (colorSchemeReadFromLocalStorage === "system") {
                            			return undefined;
                            		}
                            
                            		switch (colorSchemeReadFromLocalStorage) {
                            			case "dark":
                            				return true;
                            			case "light":
                            				return false;
                            		}
                            	})();
                            
                            	const isDarkFromOsPreference = (() => {
                            		if (!window.matchMedia) {
                            			return undefined;
                            		}
                            
                            		return window.matchMedia("(prefers-color-scheme: dark)").matches;
                            	})();
                            
                            	const isDarkFallback = false;
                            
                            	return (
                            		isDarkFromLocalStorage ??
                            		isDarkExplicitlyProvidedAsParameter ??
                            		isDarkFromOsPreference ??
                            		isDarkFallback
                            	);
                            
                            })();

                            console.log("isDark in inline js: " + isDark ? "true":"false");
                            
                            ["${data_fr_scheme}", "${data_fr_theme}"].forEach(attr => document.documentElement.setAttribute(attr, isDark ? "dark" : "light"));

                            {

                                const element = document.createElement("style");

                                element.id = "${rootColorSchemeStyleTagId}";

                                element.innerHTML = \`:root { color-scheme: \${isDark ? "dark" : "light"}; }\`;

                                document.head.appendChild(element);

                            }

                            {
                    
                                const element = document.createElement("meta");
                    
                                element.name = "theme-color";
                    
                                element.content = isDark ? "${
                                    getColors(true).decisions.background.default.grey.default
                                }" : "${
                            getColors(false).decisions.background.default.grey.default
                        }";
                    
                                document.head.appendChild(element);

                            }
				`
                    }}
                ></script>
            )}
        </>
    );
}
