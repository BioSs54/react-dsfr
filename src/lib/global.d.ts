declare module "@gouvfr/dsfr/dist/dsfr.module" {}

declare module "*.svg";
declare module "*.woff2" {
    const _default: string;
    export default _default;
}

declare module "*.png";
declare module "*.ico";

declare module "*.webmanifest" {
    const _default: string;
    export default _default;
}
