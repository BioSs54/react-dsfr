import React from "react";
import { objectKeys } from "tsafe/objectKeys";
import { getAssetUrl } from "../tools/getAssetUrl";
import AppleTouchIcon from "../dsfr/favicon/apple-touch-icon.png";
import FaviconSvg from "../dsfr/favicon/favicon.svg";
import FaviconIco from "../dsfr/favicon/favicon.ico";
import { getScriptToRunAsap } from "../useIsDark/scriptToRunAsap";
import { fontUrlByFileBasename } from "./fontUrlByFileBasename";
import "../dsfr/dsfr.css";
import "../dsfr/utility/icons/icons.css";
const isProduction = process.env.NODE_ENV !== "development";
export function DsfrHead(props) {
    const { defaultColorScheme, preloadFonts = [] } = props;
    return (React.createElement(React.Fragment, null,
        isProduction &&
            objectKeys(fontUrlByFileBasename)
                .filter(fileBasename => preloadFonts.includes(fileBasename))
                .map(fileBasename => fontUrlByFileBasename[fileBasename])
                .map(url => (React.createElement("link", { key: url, rel: "preload", href: url, as: "font", crossOrigin: "anonymous" }))),
        React.createElement("link", { rel: "apple-touch-icon", href: getAssetUrl(AppleTouchIcon) }),
        React.createElement("link", { rel: "icon", href: getAssetUrl(FaviconSvg), type: "image/svg+xml" }),
        React.createElement("link", { rel: "shortcut icon", href: getAssetUrl(FaviconIco), type: "image/x-icon" }),
        isProduction && (React.createElement("script", { dangerouslySetInnerHTML: { "__html": getScriptToRunAsap(defaultColorScheme) } }))));
}
//# sourceMappingURL=DsfrHead.js.map