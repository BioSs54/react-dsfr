import React, { useReducer, useEffect, useMemo, useState, useId, type ReactNode } from "react";
import { fr } from "../fr";
import { createComponentI18nApi } from "../i18n";
import { getLink, type RegisteredLinkProps } from "../link";
import { createModal } from "../Modal";
import type { ExtractFinalityFromFinalityDescription, FinalityConsent } from "./types";
import type { ProcessConsentChanges } from "./processConsentChanges";
import { FooterBottomItem } from "../Footer";
import { useLang } from "../i18n";
import { useIsModalOpen } from "../Modal/useIsModalOpen";
import { isBrowser } from "../tools/isBrowser";
import { objectKeys } from "tsafe/objectKeys";
import { assert } from "tsafe/assert";
import {
    createProcessConsentChanges,
    createFullDenyFinalityConsent
} from "./processConsentChanges";

export function createConsentBannerAndConsentManagement<
    FinalityDescription extends Record<
        string,
        { title: ReactNode; description?: ReactNode; subFinalities?: Record<string, ReactNode> }
    >
>(params: {
    finalityDescription: ((params: { lang: string }) => FinalityDescription) | FinalityDescription;
    useFinalityConsent: () =>
        | FinalityConsent<ExtractFinalityFromFinalityDescription<FinalityDescription>>
        | undefined;
    processConsentChanges: ProcessConsentChanges<
        ExtractFinalityFromFinalityDescription<FinalityDescription>
    >;
    personalDataPolicyLinkProps?: RegisteredLinkProps;
    finalities: ExtractFinalityFromFinalityDescription<FinalityDescription>[];
}) {
    const {
        finalityDescription,
        useFinalityConsent,
        processConsentChanges,
        personalDataPolicyLinkProps,
        finalities
    } = params;

    const { ConsentManagement, consentModalButtonProps, useIsConsentManagementOpen } =
        createConsentManagement({
            finalityDescription,
            personalDataPolicyLinkProps,
            useFinalityConsent,
            processConsentChanges,
            finalities
        });

    const { ConsentBanner } = createConsentBanner({
        personalDataPolicyLinkProps,
        processConsentChanges,
        consentModalButtonProps
    });

    const { FooterConsentManagementItem } = createFooterConsentManagementItem({
        consentModalButtonProps
    });

    function ConsentBannerAndConsentManagement() {
        const [isHydrated, setIsHydrated] = useReducer(() => true, false);

        useEffect(() => {
            processConsentChanges({ "type": "no changes but trigger callbacks" });

            setIsHydrated();
        }, []);

        const finalityConsent = useFinalityConsent();

        const isConsentManagementOpen = useIsConsentManagementOpen();

        if (!isHydrated) {
            return null;
        }

        return (
            <>
                {finalityConsent === undefined && !isConsentManagementOpen && <ConsentBanner />}
                <ConsentManagement />
            </>
        );
    }

    const { FooterPersonalDataPolicyItem } = createFooterPersonalDataPolicyItem({
        personalDataPolicyLinkProps
    });

    return {
        ConsentBannerAndConsentManagement,
        FooterConsentManagementItem,
        FooterPersonalDataPolicyItem
    };
}

function createConsentBanner<Finality extends string>(params: {
    personalDataPolicyLinkProps: RegisteredLinkProps | undefined;
    processConsentChanges: ProcessConsentChanges<Finality>;
    consentModalButtonProps: {
        "aria-controls": string;
        "data-fr-opened": boolean;
    };
}) {
    const { personalDataPolicyLinkProps, processConsentChanges, consentModalButtonProps } = params;

    function ConsentBanner() {
        const { t } = useTranslation();

        const [hostname, setHostname] = useState("");

        const [isProcessingChanges, setIsProcessingChanges] = useState(false);

        console.log("consent banner render", { isProcessingChanges });

        useEffect(() => {
            if (!isBrowser) {
                return;
            }

            setHostname(location.host);

            return () => {
                console.log("consent banner cleanup");
            };
        }, []);

        return (
            <>
                <div className={fr.cx("fr-consent-banner")}>
                    <h2 className={fr.cx("fr-h6")}>{t("about cookies", { hostname })}</h2>
                    <div /*className={fr.cx("fr-consent-banner__content")}*/>
                        <p className={fr.cx("fr-text--sm")}>
                            {t("welcome message", { personalDataPolicyLinkProps })}
                        </p>
                    </div>
                    <ul
                        className={fr.cx(
                            "fr-consent-banner__buttons",
                            "fr-btns-group",
                            "fr-btns-group--right",
                            "fr-btns-group--inline-reverse",
                            "fr-btns-group--inline-sm"
                        )}
                    >
                        <li>
                            <button
                                className={fr.cx("fr-btn")}
                                title={t("accept all - title")}
                                onClick={async () => {
                                    setIsProcessingChanges(true);
                                    await processConsentChanges({ "type": "grantAll" });
                                    setIsProcessingChanges(false);
                                }}
                                disabled={isProcessingChanges}
                            >
                                {t("accept all")}
                            </button>
                        </li>
                        <li>
                            <button
                                className={fr.cx("fr-btn")}
                                title={t("refuse all - title")}
                                onClick={() => {
                                    setIsProcessingChanges(true);
                                    processConsentChanges({ "type": "denyAll" });
                                    setIsProcessingChanges(false);
                                }}
                                disabled={isProcessingChanges}
                            >
                                {t("refuse all")}
                            </button>
                        </li>
                        <li>
                            <button
                                className={fr.cx("fr-btn", "fr-btn--secondary")}
                                title={t("customize cookies - title")}
                                disabled={isProcessingChanges}
                                {...consentModalButtonProps}
                            >
                                {t("customize")}
                            </button>
                        </li>
                    </ul>
                </div>
            </>
        );
    }

    return { ConsentBanner };
}

function createConsentManagement<
    FinalityDescription extends Record<
        string,
        { title: ReactNode; description?: ReactNode; subFinalities?: Record<string, ReactNode> }
    >
>(params: {
    personalDataPolicyLinkProps: RegisteredLinkProps | undefined;
    finalityDescription: ((params: { lang: string }) => FinalityDescription) | FinalityDescription;
    useFinalityConsent: () =>
        | FinalityConsent<ExtractFinalityFromFinalityDescription<FinalityDescription>>
        | undefined;
    processConsentChanges: ProcessConsentChanges<
        ExtractFinalityFromFinalityDescription<FinalityDescription>
    >;
    finalities: ExtractFinalityFromFinalityDescription<FinalityDescription>[];
}) {
    type Finality = typeof finalities[number];

    const {
        finalityDescription: finalityDescriptionOrGetFinalityDescription,
        personalDataPolicyLinkProps,
        useFinalityConsent,
        processConsentChanges,
        finalities
    } = params;

    const modal = createModal({
        "isOpenedByDefault": false,
        "id": "fr-consent-modal"
    });

    function ConsentManagement() {
        const lang = useLang();

        const { t } = useTranslation();

        const finalityDescription = useMemo(
            () =>
                typeof finalityDescriptionOrGetFinalityDescription === "function"
                    ? finalityDescriptionOrGetFinalityDescription({ lang })
                    : finalityDescriptionOrGetFinalityDescription,
            [lang]
        );

        const { processLocalConsentChange, localFinalityConsent } = (function useClosure() {
            const realFinalityConsent = useFinalityConsent();

            const [localFinalityConsent, setLocalFinalityConsent] = useState<
                FinalityConsent<ExtractFinalityFromFinalityDescription<FinalityDescription>>
            >(() => realFinalityConsent ?? createFullDenyFinalityConsent(finalities));

            useEffect(() => {
                if (realFinalityConsent === undefined) {
                    return;
                }
                setLocalFinalityConsent(realFinalityConsent);
            }, [realFinalityConsent]);

            const { processConsentChanges } = useMemo(
                () =>
                    createProcessConsentChanges({
                        "callback": undefined,
                        finalities,
                        "getFinalityConsent": () => localFinalityConsent,
                        "setFinalityConsent": ({ finalityConsent }) =>
                            setLocalFinalityConsent(finalityConsent)
                    }),
                []
            );

            const processLocalConsentChange: (
                params:
                    | {
                          type: "grantAll" | "denyAll";
                      }
                    | {
                          type: "atomic change";
                          finality: Finality;
                          isConsentGiven: boolean;
                      }
            ) => void = processConsentChanges;

            return { processLocalConsentChange, localFinalityConsent };
        })();

        const [isProcessingChanges, setIsProcessingChanges] = useState(false);

        const createOnAcceptOrRefuseAll =
            (type: "grantAll" | "denyAll" | "apply local changes") => async () => {
                setIsProcessingChanges(true);

                switch (type) {
                    case "apply local changes":
                        await processConsentChanges({
                            "type": "new finalityConsent explicitly provided",
                            "finalityConsent": localFinalityConsent
                        });
                        break;
                    case "denyAll":
                    case "grantAll":
                        processLocalConsentChange({ type });
                        await processConsentChanges({ type });
                        break;
                }

                setIsProcessingChanges(false);
                modal.close();
            };

        return (
            <modal.Component title={t("consent modal title")} size="large">
                <div>
                    <div className={fr.cx("fr-consent-service", "fr-consent-manager__header")}>
                        <fieldset className={fr.cx("fr-fieldset", "fr-fieldset--inline")}>
                            <legend className={fr.cx("fr-consent-service__title")}>
                                {t("preferences for all services", { personalDataPolicyLinkProps })}
                            </legend>
                            <div className={fr.cx("fr-consent-service__radios")}>
                                <div
                                    className={fr.cx(
                                        "fr-btns-group",
                                        "fr-btns-group--inline",
                                        "fr-btns-group--right"
                                    )}
                                >
                                    <button
                                        title={t("accept all - title")}
                                        className={fr.cx("fr-btn")}
                                        onClick={createOnAcceptOrRefuseAll("grantAll")}
                                        disabled={isProcessingChanges}
                                    >
                                        {t("accept all")}
                                    </button>{" "}
                                    <button
                                        title={t("refuse all - title")}
                                        className={fr.cx("fr-btn", "fr-btn--secondary")}
                                        disabled={isProcessingChanges}
                                        onClick={createOnAcceptOrRefuseAll("denyAll")}
                                    >
                                        {t("refuse all")}
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div className="fr-consent-service">
                        <fieldset className="fr-fieldset fr-fieldset--inline">
                            <legend
                                aria-describedby="finality-0-desc"
                                className="fr-consent-service__title"
                            >
                                Cookies obligatoires
                            </legend>
                            <div className="fr-consent-service__radios">
                                <div className="fr-radio-group">
                                    <input
                                        checked={true}
                                        disabled={true}
                                        type="radio"
                                        id="consent-finality-0-accept"
                                        name="consent-finality-0"
                                        data-fr-js-radio-actionee="true"
                                    />
                                    <label htmlFor="consent-finality-0-accept" className="fr-label">
                                        Accepter
                                    </label>
                                </div>
                                <div className="fr-radio-group">
                                    <input
                                        disabled={true}
                                        type="radio"
                                        id="consent-finality-0-refuse"
                                        name="consent-finality-0"
                                        data-fr-js-radio-actionee="true"
                                    />{" "}
                                    <label htmlFor="consent-finality-0-refuse" className="fr-label">
                                        Refuser
                                    </label>
                                </div>
                            </div>
                            <p id="finality-0-desc" className="fr-consent-service__desc">
                                Ce site utilise des cookies nécessaires à son bon fonctionnement qui
                                ne peuvent pas être désactivés.
                            </p>
                        </fieldset>
                    </div>

                    {objectKeys(finalityDescription)
                        .map(finality => ({
                            "finality": (assert(typeof finality === "string"), finality),
                            "wrap": finalityDescription[finality]
                        }))
                        .map(({ finality, wrap }) => (
                            <ConsentService
                                key={finality}
                                title={wrap.title}
                                description={wrap.description}
                                subFinalities={wrap.subFinalities}
                                onChange={({ subFinality, isConsentGiven }) =>
                                    processLocalConsentChange({
                                        "type": "atomic change",
                                        "finality": (subFinality === undefined
                                            ? finality
                                            : `${finality}.${subFinality}`) as Finality,
                                        isConsentGiven
                                    })
                                }
                                finalityConsent={
                                    localFinalityConsent[
                                        finality as keyof typeof localFinalityConsent
                                    ]
                                }
                            />
                        ))}

                    <ul
                        className={fr.cx(
                            "fr-consent-manager__buttons",
                            "fr-btns-group",
                            "fr-btns-group--right",
                            "fr-btns-group--inline-sm"
                        )}
                    >
                        <li>
                            <button className={fr.cx("fr-btn")} disabled={isProcessingChanges}>
                                Confirmer mes choix
                            </button>
                        </li>
                    </ul>
                </div>
            </modal.Component>
        );
    }

    function ConsentService(props: {
        title: ReactNode;
        description: ReactNode | undefined;
        subFinalities: Record<string, ReactNode> | undefined;
        finalityConsent:
            | boolean
            | ({
                  isFullConsent: boolean;
              } & Record<string, boolean>);
        onChange: (params: { subFinality: string | undefined; isConsentGiven: boolean }) => void;
    }) {
        const { title, description, subFinalities, finalityConsent, onChange } = props;

        const { legendId, descriptionId, acceptInputId, refuseInputId, subFinalityDivId } =
            (function useClosure() {
                const id = useId();

                const legendId = `finality-${id}-legend`;

                const descriptionId = `finality-${id}-desc`;

                const acceptInputId = `consent-finality-${id}-accept`;

                const refuseInputId = `consent-finality-${id}-refuse`;

                const subFinalityDivId = `finality-${id}-collapse`;

                return { legendId, descriptionId, acceptInputId, refuseInputId, subFinalityDivId };
            })();

        const macroState: "full consent" | "full refusal" | "partial consent" =
            typeof finalityConsent === "boolean"
                ? finalityConsent
                    ? "full consent"
                    : "full refusal"
                : finalityConsent.isFullConsent
                ? "full consent"
                : "partial consent";

        if (Date.now() < 0) {
            console.log(subFinalities, finalityConsent, onChange);
        }

        return (
            <div className={fr.cx("fr-consent-service")}>
                <fieldset
                    aria-labelledby={`${legendId} ${descriptionId}`}
                    role="group"
                    className={fr.cx("fr-fieldset")}
                >
                    <legend id={legendId} className={fr.cx("fr-consent-service__title")}>
                        {title}
                    </legend>
                    <div className={fr.cx("fr-consent-service__radios")}>
                        <div className={fr.cx("fr-radio-group")}>
                            <input
                                type="radio"
                                id={acceptInputId}
                                checked={macroState === "full consent"}
                                onChange={() =>
                                    onChange({ "subFinality": undefined, "isConsentGiven": true })
                                }
                            />
                            <label className="fr-label" htmlFor={acceptInputId}>
                                Accepter
                            </label>
                        </div>
                        <div className={fr.cx("fr-radio-group")}>
                            <input
                                type="radio"
                                id={refuseInputId}
                                checked={macroState === "full refusal"}
                                onChange={() =>
                                    onChange({ "subFinality": undefined, "isConsentGiven": false })
                                }
                            />
                            <label className={fr.cx("fr-label")} htmlFor={refuseInputId}>
                                Refuser
                            </label>
                        </div>
                    </div>
                    {description !== undefined && (
                        <p id="finality-1-desc" className="fr-consent-service__desc">
                            {description}
                        </p>
                    )}
                    <div className={fr.cx("fr-consent-service__collapse")}>
                        <button
                            className={fr.cx("fr-consent-service__collapse-btn")}
                            aria-expanded="false"
                            aria-describedby={legendId}
                            aria-controls={subFinalityDivId}
                        >
                            Voir plus de détails
                        </button>
                    </div>
                    <div
                        className={fr.cx("fr-consent-services", "fr-collapse")}
                        id={subFinalityDivId}
                    >
                        <div className={fr.cx("fr-consent-service")}>
                            <fieldset className={fr.cx("fr-fieldset", "fr-fieldset--inline")}>
                                <legend
                                    id="finality-1-service-1-legend"
                                    className="fr-consent-service__title"
                                >
                                    Sous finalité 1
                                </legend>
                                <div className="fr-consent-service__radios fr-fieldset--inline">
                                    <div className="fr-radio-group">
                                        <input
                                            type="radio"
                                            id="consent-finality-1-service-1-accept"
                                            name="consent-finality-1-service-1"
                                        />
                                        <label
                                            className="fr-label"
                                            htmlFor="consent-finality-1-service-1-accept"
                                        >
                                            Accepter
                                        </label>
                                    </div>
                                    <div className="fr-radio-group">
                                        <input
                                            type="radio"
                                            id="consent-finality-1-service-1-refuse"
                                            name="consent-finality-1-service-1"
                                        />
                                        <label
                                            className="fr-label"
                                            htmlFor="consent-finality-1-service-1-refuse"
                                        >
                                            Refuser
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="fr-consent-service">
                            <fieldset
                                aria-labelledby="finality-1-service-2-legend finality-1-service-2-desc"
                                role="group"
                                className="fr-fieldset fr-fieldset--inline"
                            >
                                <legend
                                    id="finality-1-service-2-legend"
                                    className="fr-consent-service__title"
                                    aria-describedby="finality-1-service-2-desc"
                                >
                                    Sous finalité 2
                                </legend>
                                <div className="fr-consent-service__radios fr-fieldset--inline">
                                    <div className="fr-radio-group">
                                        <input
                                            type="radio"
                                            id="consent-finality-1-service-2-accept"
                                            name="consent-finality-1-service-2"
                                        />
                                        <label
                                            className="fr-label"
                                            htmlFor="consent-finality-1-service-2-accept"
                                        >
                                            Accepter
                                        </label>
                                    </div>
                                    <div className="fr-radio-group">
                                        <input
                                            type="radio"
                                            id="consent-finality-1-service-2-refuse"
                                            name="consent-finality-1-service-2"
                                        />
                                        <label
                                            className="fr-label"
                                            htmlFor="consent-finality-1-service-2-refuse"
                                        >
                                            Refuser
                                        </label>
                                    </div>
                                </div>
                                <p
                                    id="finality-1-service-2-desc"
                                    className="fr-consent-service__desc"
                                >
                                    Ce service utilise 3 cookies.
                                </p>
                            </fieldset>
                        </div>
                        <div className="fr-consent-service">
                            <fieldset className="fr-fieldset fr-fieldset--inline">
                                <legend
                                    id="finality-1-service-3-legend"
                                    className="fr-consent-service__title"
                                >
                                    Sous finalité 3
                                </legend>
                                <div className="fr-consent-service__radios fr-fieldset--inline">
                                    <div className="fr-radio-group">
                                        <input
                                            type="radio"
                                            id="consent-finality-1-service-3-accept"
                                            name="consent-finality-1-service-3"
                                        />
                                        <label
                                            className="fr-label"
                                            htmlFor="consent-finality-1-service-3-accept"
                                        >
                                            Accepter
                                        </label>
                                    </div>
                                    <div className="fr-radio-group">
                                        <input
                                            type="radio"
                                            id="consent-finality-1-service-3-refuse"
                                            name="consent-finality-1-service-3"
                                        />
                                        <label
                                            className="fr-label"
                                            htmlFor="consent-finality-1-service-3-refuse"
                                        >
                                            Refuser
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    }

    const consentModalButtonProps = modal.buttonProps;

    function useIsConsentManagementOpen() {
        return useIsModalOpen(modal);
    }

    return { ConsentManagement, consentModalButtonProps, useIsConsentManagementOpen };
}

function createFooterConsentManagementItem(params: {
    consentModalButtonProps: {
        "aria-controls": string;
        "data-fr-opened": boolean;
    };
}) {
    const { consentModalButtonProps } = params;

    function FooterConsentManagementItem() {
        const { t } = useTranslation();

        return (
            <FooterBottomItem
                bottomItem={{
                    "buttonProps": consentModalButtonProps,
                    "text": t("cookies management")
                }}
            />
        );
    }

    return { FooterConsentManagementItem };
}

function createFooterPersonalDataPolicyItem(params: {
    personalDataPolicyLinkProps: RegisteredLinkProps | undefined;
}) {
    const { personalDataPolicyLinkProps } = params;

    function FooterPersonalDataPolicyItem() {
        const { t } = useTranslation();

        if (personalDataPolicyLinkProps === undefined) {
            throw new Error(
                [
                    "You should provide a personalDataPolicyLinkProps to createGdprApi if",
                    "you want to add a link to the personal data policy in the footer"
                ].join(" ")
            );
        }

        return (
            <FooterBottomItem
                bottomItem={{
                    "text": t("personal data"),
                    "linkProps": personalDataPolicyLinkProps
                }}
            />
        );
    }
    return { FooterPersonalDataPolicyItem };
}

const { useTranslation, addGdprTranslations } = createComponentI18nApi({
    "componentName": "Gdpr",
    "frMessages": {
        /** cspell: disable */
        "all services pref": "Préférences pour tous les services.",
        "personal data cookies": "Données personnelles et cookies",
        "accept all": "Tout accepter",
        "accept all - title": "Autoriser tous les cookies",
        "refuse all": "Tout refuser",
        "refuse all - title": "Refuser tous les cookies",
        "accept": "Accepter",
        "refuse": "Refuser",
        "confirm choices": "Confirmer mes choix",
        "about cookies": (p: { hostname: string }) => `À propos des cookies sur ${p.hostname}`,
        "welcome message": (p: {
            personalDataPolicyLinkProps: RegisteredLinkProps | undefined;
        }) => {
            const { Link } = getLink();
            return (
                <>
                    Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience et les
                    services disponibles sur ce site.
                    {p.personalDataPolicyLinkProps !== undefined && (
                        <>
                            {" "}
                            Pour en savoir plus, visitez la page{" "}
                            <Link {...p.personalDataPolicyLinkProps}>
                                Données personnelles et cookies
                            </Link>
                            .
                        </>
                    )}
                    Vous pouvez, à tout moment, avoir le contrôle sur les cookies que vous souhaitez
                    activer.
                </>
            );
        },
        "customize": "Personnaliser",
        "customize cookies - title": "Personnaliser les cookies",
        "consent modal title": "Panneau de gestion des cookies",
        "cookies management": "Gestion des cookies",
        "personal data": "Données personnelles",
        "preferences for all services": (p: {
            personalDataPolicyLinkProps: RegisteredLinkProps | undefined;
        }) => {
            const { Link } = getLink();
            return (
                <>
                    Préférences pour tous les services.
                    <br />
                    {p.personalDataPolicyLinkProps !== undefined && (
                        <Link {...p.personalDataPolicyLinkProps}>
                            Données personnelles et cookies
                        </Link>
                    )}
                </>
            );
        }
        /** cspell: enable */
    }
});

addGdprTranslations({
    "lang": "en",
    "messages": {
        "all services pref": "Preferences for all services.",
        "personal data cookies": "Personal data and cookies",
        "accept all": "Accept all",
        "accept all - title": "Accept all cookies",
        "refuse all": "Refuse all",
        "refuse all - title": "Refuse all cookies",
        "accept": "Accept",
        "refuse": "Refuse",
        "confirm choices": "Confirm my choices",
        "about cookies": p => `About cookies on ${p.hostname}`,
        "welcome message": p => {
            const { Link } = getLink();
            return (
                <>
                    Welcome to our website! We use cookies to improve your experience and the
                    services available services available on this site.
                    {p.personalDataPolicyLinkProps !== undefined && (
                        <>
                            To learn more, visit the{" "}
                            <Link {...p.personalDataPolicyLinkProps}>
                                "Personal Data and Cookies"
                            </Link>{" "}
                            page.
                        </>
                    )}
                    You can, at any time, have control over which cookies you wish to enable at any
                    time.
                </>
            );
        },
        "customize": "Customize",
        "customize cookies - title": "Customize cookies",
        "consent modal title": "Cookie management panel",
        "cookies management": "Cookies management",
        "preferences for all services": (p: {
            personalDataPolicyLinkProps: RegisteredLinkProps | undefined;
        }) => {
            const { Link } = getLink();
            return (
                <>
                    Preferences for all services <br />
                    {p.personalDataPolicyLinkProps !== undefined && (
                        <Link {...p.personalDataPolicyLinkProps}>Personal data and cookies</Link>
                    )}
                </>
            );
        }
    }
});

export { addGdprTranslations };