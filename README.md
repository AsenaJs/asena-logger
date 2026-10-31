<p width="%100" align="center">
  <img src="https://avatars.githubusercontent.com/u/179836938?s=200&v=4" width="150" align="center"/>
</p>

# AsenaLogger

[![Version](https://img.shields.io/npm/v/@asenajs/asena-logger.svg)](https://github.com/AsenaJs/asena-logger)
[![Bun Version](https://img.shields.io/badge/Bun-1.4%2B-blueviolet)](https://bun.sh)

Winston-based logger for the Asena framework, with colored, timestamped console output and profiling.

**Requirements:** Bun 1.4+, `@asenajs/asena` 0.11+.

## Installation

```bash
bun add @asenajs/asena-logger
```

## Quick Start

```typescript
import { AsenaServerFactory } from '@asenajs/asena';
import { createErgenecoreAdapter } from '@asenajs/ergenecore';
import { AsenaLogger } from '@asenajs/asena-logger';

export const logger = new AsenaLogger();

const server = await AsenaServerFactory.create({
  adapter: createErgenecoreAdapter(),
  logger,
  port: 3000,
});

await server.start();

logger.info('User created', { userId: 42 });
```

## Documentation

Full documentation: [asena.sh/docs/packages/logger](https://asena.sh/docs/packages/logger)

## License

MIT License - see [LICENSE](LICENSE) file.
