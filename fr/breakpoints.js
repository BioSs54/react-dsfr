import { BreakpointsValues as values, BreakpointsValuesUnit as unit, breakpointKeys as keys } from "./generatedFromCss/breakpoints";
import { assert } from "tsafe/assert";
import { getBaseFontSizePx } from "../tools/getBaseFontSizePx";
const epsilon = 0.003125;
export const breakpoints = {
    "up": (key) => `@media (min-width:${values[key]}${unit})`,
    "down": (key) => `@media (max-width:${values[key] - epsilon}${unit})`,
    "between": (start, end) => `@media (min-width:${values[start]}${unit}) and (max-width:${values[end] - epsilon}${unit})`,
    "only": (key) => keys.indexOf(key) + 1 < keys.length
        ? breakpoints.between(key, keys[keys.indexOf(key) + 1])
        : breakpoints.up((assert(key !== "xs"), key)),
    "not": (key) => {
        // handle first and last key separately, for better readability
        const keyIndex = keys.indexOf(key);
        if (keyIndex === 0) {
            return breakpoints.up(keys[1]);
        }
        if (keyIndex === keys.length - 1) {
            const key = keys[keyIndex];
            assert(key !== "xs");
            return breakpoints.down(key);
        }
        return breakpoints
            .between(key, keys[keys.indexOf(key) + 1])
            .replace("@media", "@media not all and");
    },
    /**
     * Returns the breakpoint values in px.
     *
     * Warning: It reflects the values at a given time, if the root font size changes so will the breakpointsValues.
     * Plus this function is rather expensive to call.
     * If you're in react you should use the
     * import { useBreakpointsValues } from "@codegouvfr/react-dsfr/useBreakpointsValues";
     */
    "getBreakpointsValues": () => {
        assert();
        const factor = getBaseFontSizePx();
        return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value * factor]));
    }
};
//# sourceMappingURL=breakpoints.js.map