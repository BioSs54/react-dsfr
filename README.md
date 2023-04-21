<p align="center">
    <img src="https://github.com/codegouvfr/react-dsfr/releases/download/assets/dsfr-react_repo-card.png">  
</p>
<p align="center">
    🇫🇷 <i><a href="https://www.systeme-de-design.gouv.fr/">French State Design System</a> React integration</i> 🇫🇷 
    <br>
    <br>
    <a href="https://github.com/codegouvfr/react-dsfr/actions">
      <img src="https://github.com/codegouvfr/react-dsfr/workflows/ci/badge.svg?branch=main">
    </a>
    <a href="https://www.npmjs.com/package/@codegouvfr/react-dsfr">
      <img src="https://img.shields.io/npm/v/@codegouvfr/react-dsfr?logo=npm">
    </a>
    <a href="https://bundlephobia.com/package/@codegouvfr/react-dsfr">
      <img src="https://img.shields.io/bundlephobia/minzip/@codegouvfr/react-dsfr">
    </a>
    <a href="https://github.com/codegouvfr/react-dsfr/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@codegouvfr/react-dsfr">
    </a>
</p>
<p align="center">
  <a href="https://react-dsfr-components.etalab.studio">Components documentation</a>
  -
  <a href="https://react-dsfr.etalab.studio/">Guides</a>
  -
  <a href="https://stackblitz.com/edit/nextjs-j2wba3?file=pages/index.tsx">Playground</a>
</p>

👉 Version française du README [ici](https://github.com/codegouvfr/react-dsfr/blob/main/README.fr.md).

> WARNING: This Design System is only meant to be used for official French's public service websites and apps.  
> Its main purpose is to make it easy to identify governmental websites for citizens. [See terms](https://www.systeme-de-design.gouv.fr/cgu/).

> 🗣️ Replay de l'atelier de présentation de la librairie [ici](https://bbb-dinum-scalelite.visio.education.fr/playback/presentation/2.3/22298bc9d93b53540248207bc3f9e31260f3b4f1-1670578779094).

This module is a wrapper/compatibility layer for [@gouvfr/dsfr](https://github.com/GouvernementFR/dsfr), the vanilla JS/CSS implementation of the DSFR.

<a href="https://youtu.be/5q88JgXUAY4">
  <img width="1712" alt="image" src="https://user-images.githubusercontent.com/6702424/224423044-c1823249-eab6-4844-af43-d059c01416af.png">
</a>

> While this module is written in TypeScript, using TypeScript in your application is optional (but recommended as it comes with outstanding benefits to both you and your codebase).

-   [x] Fully TypeSafe, well documented API.
-   [x] Always in up to date with latest the DSFR evolutions.
        Code and Types generated from [`@gouvfr/dsfr`](https://www.npmjs.com/package/@gouvfr/dsfr)`/dist/dsfr.css`.
-   [x] Exactly the same look and feel than with [@gouvfr/dsfr](https://www.npmjs.com/package/@gouvfr/dsfr).
-   [x] No [white flash when reloading in SSR setup](https://github.com/codegouvfr/@codegouvfr/react-dsfr/issues/2#issuecomment-1257263480).
-   [x] Most components are server component ready. The others are labeled with `"use client";`
-   [x] [Perfect integration with all major React framework: Next.js (PagesDir and AppDir), Create React App, Vue](https://react-dsfr.etalab.studio/).
-   [ ] All [the components](https://www.systeme-de-design.gouv.fr/elements-d-interface) are implemented (21/41, [see details](COMPONENTS.md))
-   [x] Three shakable distribution, cherry pick the components you import. (It's not all in a big .js bundle)
-   [x] Optional integration with [MUI](https://mui.com/). If you use MUI components they will
        be automatically adapted to look like [DSFR components](https://www.systeme-de-design.gouv.fr/elements-d-interface). See [documentation](https://react-dsfr.etalab.studio/mui-integration).
-   [x] Enable CSS in JS by providing a `useColors()` hooks that exposes the correct colors options and decision
        for the currently enabled color scheme.
-   [x] Opt-in i18n, built in text can be displayed in multiple languages and user can provide extra translations.
-   [x] [Support routing libraries](https://react-dsfr.etalab.studio/routing) like react-router.

This module is a product of [Etalab's Free and open source software pole](https://communs.numerique.gouv.fr/a-propos/).
I'm working full time on this project. You can expect rapid development.

<p align="center">
  <a href="https://react-dsfr.etalab.studio/">🚀 Get started 🚀 </a>
</p>

# What about [`@dataesr/react-dsfr`](https://github.com/dataesr/react-dsfr)?

If your project is using [`@dataesr/react-dsfr`](https://github.com/dataesr/react-dsfr) and you're not willing to migrate to `@codegouvfr/react-dsfr` you can still benefit from some of this project features:

-   The [`fr-*` classes autocompletion and type safety](https://react-dsfr.etalab.studio/class-names-type-safety).
-   Use [the type safe color system](https://react-dsfr.etalab.studio/css-in-js#colors).
-   Use the MUI theme.
-   The [the spacing system](https://react-dsfr.etalab.studio/css-in-js#fr.spacing) and
    [breakpoints util for building responsive UI](https://react-dsfr.etalab.studio/css-in-js#fr.breakpoints).

[Here is a playground to demonstrate it](https://stackblitz.com/edit/react-ts-fph9bh?file=App.tsx).

## Development

```bash
git clone https://github.com/codegouvfr/react-dsfr
cd react-dsfr
yarn

# Starting storybook
yarn storybook

# Starting test apps
yarn start-cra  # For testing in in a Create React App setup
yarn start-vite # For testing in a Vite setup
yarn start-next-pagesdir # For testing in a Next.js 13 PagesDir setup (the default setup)
yarn start-next-appdir # For testing in a Next.js 13 AppDir setup

# Run all unit test (test/runtime):
yarn test
# Run only test/runtime/cssVariable.test.ts (for example)
npx vitest -t "Resolution of CSS variables"

# Debugging while unit testing
```

### Looking to contribute?

Thank you! [Here](https://github.com/codegouvfr/react-dsfr/blob/main/CONTRIBUTING.md) is the contribution guide.

### How to publish a new version on NPM, how to release a beta version

This repo was bootstrapped form [garronej/ts-ci](https://github.com/garronej/ts-ci) have a look at the
documentation of this starter for understanding the lifecycle of this repo.

## Usecases

A few project **that I know of** that uses `@codegouvfr/react-dsfr`.

-   https://immersion-facile.beta.gouv.fr/
-   https://github.com/BaseAdresseNationale/adresse.data.gouv.fr
-   https://github.com/DISIC/observatoire.numerique.gouv.fr
-   https://github.com/DISIC/monfranceconnect
-   https://github.com/InseeFr/Lunatic-DSFR
-   https://github.com/EIG6-Geocommuns/lidarviz-front
-   https://github.com/EIG6-Geocommuns/geocommuns-core
-   https://github.com/SocialGouv/bpco-site
-   https://github.com/EIG6-ArtificIA/predictia_front
-   https://github.com/BaseAdresseNationale/bal-admin
-   https://github.com/etalab/sill-web
-   https://github.com/inclusion-numerique/mediature
-   https://territoiresentransitions.fr (maybe)

Keep in mind that the project has been released recently so it's only natural
that there is only a few project in production using it.
