# @asenajs/asena-logger

## 2.0.0

### Major Changes

- `@asenajs/asena` is now a peer dependency, at `^0.10.0`

  `AsenaLogger` imports `blue`, `green`, `red` and `yellow` from `@asenajs/asena/logger` and uses
  them as runtime values, and the import survives into the published `dist`. But core appeared only
  in `devDependencies`, so the manifest never said the package needs it — an install without core
  present would fail at import time. In practice nobody installs a logger for Asena without Asena,
  which is why this went unnoticed.

  It belongs in the peer contract rather than in `dependencies` for the same reason `hono` and `zod`
  do in the adapters: `ServerLogger` crosses this package's public API, so the application and the
  logger must hold the _same_ copy of core. A regular dependency would give this package its own
  resolution slot.

  **Breaking:** requires `@asenajs/asena@^0.10.0`. There was no peer range before, so this is the
  first version that states a core requirement at all — an application on 0.9.x gets an unmet peer.
