export * from "./start";
export { useIsDark, $isDark } from "./darkMode";
export * from "./colors";
export type { BreakpointKeys } from "./breakpoints";
import { breakpoints } from "./breakpoints";
import { spacing } from "./spacing";
export type { SpacingToken } from "./spacing";
import { cx } from "./cx";
export type { FrCxArg } from "./cx";
export { DsfrLangProvider } from "./i18n";

export const fr = {
    breakpoints,
    spacing,
    cx
};