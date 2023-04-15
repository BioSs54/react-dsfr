import { type ReactNode, useMemo } from "react";

function getLanguageBestApprox<Language extends string>(params: {
    languages: readonly Language[];
    languageLike: string;
}): Language | undefined {
    const { languages, languageLike } = params;

    scope: {
        const lang = languages.find(lang => lang.toLowerCase() === languageLike.toLowerCase());

        if (lang === undefined) {
            break scope;
        }

        return lang;
    }

    scope: {
        const iso2LanguageLike = languageLike.split("-")[0].toLowerCase();

        const lang = languages.find(lang => lang.toLowerCase().includes(iso2LanguageLike));

        if (lang === undefined) {
            break scope;
        }

        return lang;
    }

    return undefined;
}

type Message = NonNullable<ReactNode> | ((params: any) => NonNullable<ReactNode>);
type Messages = Record<string, Message>;

type FrMessagesToTranslationFunction<FrMessages extends Messages> = {
    (messageKey: NonFunctionMessageKey<FrMessages>): string;
    <K extends FunctionMessageKey<FrMessages>>(
        messageKey: K,
        params: ExtractArgument<FrMessages[K]>
    ): string;
};

type ExtractArgument<TMessage extends Message> = TMessage extends (
    params: any
) => Exclude<Message, string>
    ? Parameters<TMessage>[0]
    : never;

type NonFunctionMessageKey<FrMessages extends Messages> = {
    [Key in keyof FrMessages]: FrMessages[Key] extends string ? Key : never;
}[keyof FrMessages];

type FunctionMessageKey<FrMessages extends Messages> = Exclude<
    keyof FrMessages,
    NonFunctionMessageKey<FrMessages>
>;

let useLang: () => string = () => "fr";

export function setUseLang(params: { useLang: () => string }) {
    useLang = params.useLang;
}

export function createComponentI18nApi<
    ComponentName extends string,
    FrMessages extends Messages
>(params: {
    componentName: ComponentName;
    frMessages: FrMessages;
}): {
    useTranslation: () => { t: FrMessagesToTranslationFunction<FrMessages> };
} & Record<
    `add${ComponentName}Translations`,
    (params: { lang: string; messages: Partial<FrMessages> }) => void
> {
    const { componentName, frMessages } = params;

    const messagesByLang = { "fr": frMessages };

    function useTranslation() {
        const lang = useLang();

        const bestMatchLang = useMemo(() => {
            const bestApproxLang = getLanguageBestApprox({
                "languages": Object.keys(messagesByLang),
                "languageLike": lang
            });

            return bestApproxLang ?? "fr";
        }, [lang]);

        function t(messageKey: keyof FrMessages, params?: any): ReactNode {
            const messageOrFn =
                (messagesByLang as any)[bestMatchLang][messageKey] ??
                (messagesByLang["fr"] as any)[messageKey];

            return params === undefined ? messageOrFn : messageOrFn(params);
        }

        return { t };
    }

    function addTranslations(params: { lang: string; messages: Partial<FrMessages> }) {
        const { lang, messages } = params;

        Object.entries(messages)
            .filter(([, value]) => value !== undefined)
            .forEach(([key, value]) => (((messagesByLang as any)[lang] ??= {})[key] = value));
    }

    return {
        useTranslation,
        [`add${componentName}Translations`]: addTranslations
    } as any;
}
