
# AsenaLogger

Just a Winston-based logging solution for the Asena.js framework.

## Installation

```bash
# bun
bun add @asenajs/asena-logger
```

## Features

- Seamless integration with Asena ecosystem
- Beautifully formatted console logs with timestamp and color-coded levels
- Error handling with stack traces
- Profile measurement for performance tracking
- Customizable log formats and transports
- Based on the robust Winston logging library

## Basic Usage

```typescript
import { AsenaLogger } from '@asenajs/asena-logger';

// Create a logger instance with default settings
const logger = new AsenaLogger();

// Log messages at different levels
logger.info('Server starting');
logger.debug('Configuration loaded', { config: 'production' });
logger.warn('Resource usage high', { memory: '85%' });
logger.error('Failed to connect to database',  new Error('Connection timeout') );

// Use custom log levels
logger.log('verbose', 'Detailed information', { context: 'auth' });

// Profile performance
logger.profile('database-query');
// ... perform database operation
logger.profile('database-query'); // Logs the time elapsed since the first call
```

## Integration with Asena.js

AsenaLogger is designed to work seamlessly with the Asena.js framework:

```typescript
import { AsenaServer } from '@asenajs/asena';
import { HonoAdapter } from '@asenajs/hono-adapter';
import { AsenaLogger } from '@asenajs/asena-logger';

// Create the logger
const logger = new AsenaLogger();

// Pass to adapter
const adapter = new HonoAdapter(logger);

// Pass to server
await new AsenaServer(adapter, logger)
  .port(3000)
  .start(true);
```

## Configuration

### Custom Winston Instance

You can provide your own Winston logger instance:

```typescript
import winston from 'winston';
import { AsenaLogger } from '@asenajs/asena-logger';

// Create a custom Winston logger
const winstonLogger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Use it with AsenaLogger
const logger = new AsenaLogger(winstonLogger);
```

`Output`:

```shell
2025-05-08 00:06:07 [INFO]:     Server starting
2025-05-08 00:06:07 [WARN]:     Resource usage high {
 "memory": "85%"
}
2025-05-08 00:06:07 [ERROR]:    Failed to connect to database Connection timeout
Error: Connection timeout
    at path/to/good/place:14:51
    at moduleEvaluation (native:1:11)
    at moduleEvaluation (native:1:11)
    at loadAndEvaluateModule (native:2)
    at processTicksAndRejections (native:7:39)
2025-05-08 00:06:07 [PROFILE]:  database-query 0ms
```

## Log Format

By default, logs are formatted as:

```
YYYY-MM-DD HH:mm:ss [LEVEL]: 	Message {"metadata":"values"} 
```

Error logs include stack traces:

```
YYYY-MM-DD HH:mm:ss [ERROR]: 	Database connection failed {"attempt":3}
Error: Connection refused
    at connectToDatabase (/app/services/db.js:42:11)
    at startServer (/app/index.js:23:5)
    ...
```

## API Reference

### Methods

- `info(message: string, meta?: any): void` - Log at info level
- `error(message: string, meta?: any): void` - Log at error level
- `warn(message: string, meta?: any): void` - Log at warn level
- `debug(message: string, meta?: any): void` - Log at debug level
- `log(level: string, message: string, meta?: any): void` - Log at custom level
- `profile(id: string): void` - Start/stop profiling with the given ID

## License

MIT
