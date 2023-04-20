import React, { type ReactNode, type CSSProperties } from "react";
import type { RegisteredLinkProps } from "./link";
import type { FrIconClassName, RiIconClassName } from "./fr/generatedFromCss/classNames";
export type FooterProps = {
    className?: string;
    brandTop: ReactNode;
    accessibility: "non compliant" | "partially compliant" | "fully compliant";
    contentDescription?: ReactNode;
    websiteMapLinkProps?: RegisteredLinkProps;
    accessibilityLinkProps?: RegisteredLinkProps;
    termsLinkProps?: RegisteredLinkProps;
    personalDataLinkProps?: RegisteredLinkProps;
    cookiesManagementLinkProps?: RegisteredLinkProps;
    homeLinkProps: RegisteredLinkProps & {
        title: string;
    };
    bottomItems?: FooterProps.BottomItem[];
    partnersLogos?: FooterProps.PartnersLogos;
    operatorLogo?: {
        orientation: "horizontal" | "vertical";
        /**
         * Expected ratio:
         * If "vertical": 9x16
         * If "horizontal": 16x9
         */
        imgUrl: string;
        /** Textual alternative of the image, it MUST include the text present in the image*/
        alt: string;
    };
    license?: ReactNode;
    classes?: Partial<Record<"root" | "body" | "brand" | "content" | "contentDesc" | "contentList" | "contentItem" | "contentLink" | "bottom" | "bottomList" | "bottomItem" | "bottomLink" | "bottomCopy" | "brandLink" | "logo" | "partners" | "partnersTitle" | "partnersLogos" | "partnersMain" | "partnersLink" | "partnersSub", string>>;
    style?: CSSProperties;
    linkList?: FooterProps.LinkList.List;
};
export declare namespace FooterProps {
    type BottomItem = BottomItem.Link | BottomItem.Button;
    namespace BottomItem {
        type Common = {
            iconId?: FrIconClassName | RiIconClassName;
            text: ReactNode;
        };
        type Link = Common & {
            linkProps: RegisteredLinkProps;
            buttonProps?: never;
        };
        type Button = Common & {
            linkProps?: undefined;
            buttonProps: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        };
    }
    namespace LinkList {
        type List = [Column, Column?, Column?, Column?, Column?, Column?];
        type Links = [
            LinkList.Link,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?,
            LinkList.Link?
        ];
        interface Column {
            categoryName?: string;
            links: Links;
        }
        interface Link {
            text: string;
            linkProps: RegisteredLinkProps;
        }
    }
    type PartnersLogos = PartnersLogos.MainOnly | PartnersLogos.SubOnly;
    namespace PartnersLogos {
        type MainOnly = {
            main: Logo;
            sub?: Logo[];
        };
        type SubOnly = {
            main?: Logo;
            sub: [Logo, ...Logo[]];
        };
        type Logo = {
            alt: string;
            href: string;
            imgUrl: string;
        };
    }
}
/** @see <https://react-dsfr-components.etalab.studio/?path=/docs/components-footer> */
export declare const Footer: React.MemoExoticComponent<React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<HTMLDivElement>>>;
export default Footer;
declare const addFooterTranslations: (params: {
    lang: string;
    messages: Partial<{
        "hide message": string;
        "website map": string;
        accessibility: string;
        "non compliant": string;
        "partially compliant": string;
        "fully compliant": string;
        terms: string;
        "personal data": string;
        "cookies management": string;
        "license mention": string;
        "etalab license": string;
        "our partners": string;
    }>;
}) => void;
export { addFooterTranslations };