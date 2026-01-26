/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

// Starlight virtual modules
declare module 'virtual:starlight/components/Search' {
  const Search: typeof import('@astrojs/starlight/components/Search.astro').default;
  export default Search;
}

declare module 'virtual:starlight/user-config' {
  const config: import('@astrojs/starlight/types').StarlightConfig;
  export default config;
}
