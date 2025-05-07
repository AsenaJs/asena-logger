import winston from 'winston';
import { blue, green, red, type ServerLogger, yellow } from '@asenajs/asena/logger';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';

const levelToColorMap = {
  info: green,
  warn: yellow,
  error: red,
  debug: blue,
};

export class AsenaLogger implements ServerLogger {

  private logger: winston.Logger;

  public constructor(
    loggerInstance?: winston.Logger,
    options?: {
      level?: string;
      format?: winston.Logform.Format;
      transports?: winston.transport[];
    },
  ) {
    if (loggerInstance) {
      this.logger = loggerInstance;
    } else {
      const defaultFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => {
          const {
            level,
            message,
            timestamp,
            durationMs,
            stack,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            [LEVEL]: _level,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            [MESSAGE]: _message,
            [SPLAT]: splat,
            ...rest
          } = info;

          // Determine if this is a profile log
          const isProfile = Object.hasOwn(info, 'durationMs');

          // Format level with color
          const levelWithColor = () => {
            if (!isProfile) {
              return levelToColorMap[level]?.(level.toUpperCase()) || level.toUpperCase();
            }

            return levelToColorMap['info']('PROFILE');
          };

          // Start building the log string with timestamp and level
          let logString = `${timestamp} [${levelWithColor()}]: \t`;

          // Handle message based on its type
          if (message instanceof Error) {
            // If message is an Error, use its message and capture stack
            logString += message.message;
            // Stack will be added at the end if available
          } else if (typeof message === 'object' && message !== null) {
            // If message is an object, stringify it
            try {
              logString += JSON.stringify(message, null, ' ');
            } catch (e) {
              logString += '[Unserializable Object]';
            }
          } else {
            // Otherwise use message as-is
            logString += message;
          }

          // Add metadata from rest and splat
          const metadata = { ...rest };

          // Add the splat contents (arguments after message) to metadata if available
          if (splat && Array.isArray(splat) && splat.length > 0) {
            // Traditional Winston formatting: logger.info('message', { meta })
            // The first splat item is typically the metadata object
            const metaFromSplat = splat[0];

            if (typeof metaFromSplat === 'object' && metaFromSplat !== null) {
              Object.assign(metadata, metaFromSplat);
            }
          }

          // Add metadata if not empty
          if (Object.keys(metadata).length > 0) {
            try {
              logString += ` ${JSON.stringify(metadata, null, 1)}`;
            } catch (e) {
              logString += ' [Unserializable Metadata]';
            }
          }

          // Add profile duration
          if (isProfile) {
            logString += ` ${durationMs}ms`;
          }

          // Add stack trace if available
          if (stack || (message instanceof Error && message.stack)) {
            logString += `\n${stack || (message as Error).stack}`;
          }

          return logString;
        }),
      );

      this.logger = winston.createLogger({
        level: options?.level || 'info',
        format: options?.format || defaultFormat,
        transports: options?.transports || [new winston.transports.Console()],
      });
    }
  }

  /**
   * Starts a profiler for the given ID or logs the duration if the ID is already being profiled.
   * Winston logs profile messages at 'info' level by default.
   * The message will be in the format "id: durationMs".
   * @param id The identifier for the profiler.
   */
  public profile(id: string): void {
    this.logger.profile(id);
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  // Custom log level
  public log(level: string, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

}
