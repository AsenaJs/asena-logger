import { describe, expect, it, mock, spyOn, beforeEach } from 'bun:test';
import type { Logger as WinstonLogger } from 'winston'; // Use an alias for clarity
import { AsenaLogger } from '../index';

// Create our mock logger instance directly.
// This object needs to satisfy the winston.Logger interface for the methods we use.
const hardcodedNpmLevels = { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 };

// This will be our mock winston.Logger compatible object
let mockWinstonInstance: WinstonLogger;

beforeEach(() => {
  // Recreate the mock instance before each test to ensure spies are fresh.
  mockWinstonInstance = {
    info: mock(() => {}),
    error: mock(() => {}),
    warn: mock(() => {}),
    debug: mock(() => {}),
    log: mock(() => {}),
    profile: mock(() => {}),
    // Add other properties/methods if AsenaLogger uses them or if strict typing demands.
    // For basic spying, the methods are key.
    // The following are added to satisfy the WinstonLogger type more completely,
    // though AsenaLogger might not directly use all of them.
    levels: hardcodedNpmLevels,
    level: 'info',
    format: {} as any, // Cast as any or provide a fuller mock Format object
    transports: [] as any, // Cast as any or provide mock transports
    // Add more properties to satisfy WinstonLogger if needed, or use 'as unknown as WinstonLogger'
    // when creating the AsenaLogger instance if the mock is intentionally partial.
    // For a more robust mock, you might need to mock more of the Logger interface.
    // Example of a few more properties:
    silent: false,
    exceptions: { handlers: new Map() } as any,
    rejections: { handlers: new Map() } as any,
    exitOnError: true,
    // Mock a few more methods that might be on the prototype or expected by type
    configure: mock(() => {}),
    child: mock(() => mockWinstonInstance), // child often returns a logger instance
    // ... etc. Add more as needed to satisfy the `WinstonLogger` type.
  } as unknown as WinstonLogger; // Cast to tell TypeScript this object is a WinstonLogger
});

describe('AsenaLogger', () => {
  it('should use the provided logger instance', () => {
    const logger = new AsenaLogger(mockWinstonInstance);

    expect(logger).toBeDefined();
    // Accessing the private 'logger' property for testing purposes.
    // This confirms that our injected mock is being used.
    expect((logger as any)['logger']).toBe(mockWinstonInstance);
  });

  it('should create a default logger if no instance is provided', () => {
    // This test would now implicitly test the default winston logger creation.
    // It's harder to spy on this without module mocking, so we might just check for existence.
    const logger = new AsenaLogger();

    expect(logger).toBeDefined();
    expect((logger as any)['logger']).toBeDefined(); // Check that an internal logger was created
    // Further checks on the default logger would be integration tests.
  });

  it('should call info on the provided logger instance', () => {
    const logger = new AsenaLogger(mockWinstonInstance);
    // spyOn is now on our directly controlled mockWinstonInstance
    const infoSpy = spyOn(mockWinstonInstance, 'info');

    logger.info('Test info message', { data: 'test' });
    expect(infoSpy).toHaveBeenCalledWith('Test info message', { data: 'test' });
  });

  it('should call error on the provided logger instance', () => {
    const logger = new AsenaLogger(mockWinstonInstance);
    const errorSpy = spyOn(mockWinstonInstance, 'error');

    logger.error('Test error message', { error: new Error('test') });
    expect(errorSpy).toHaveBeenCalledWith('Test error message', { error: new Error('test') });
  });

  it('should call warn on the provided logger instance', () => {
    const logger = new AsenaLogger(mockWinstonInstance);
    const warnSpy = spyOn(mockWinstonInstance, 'warn');

    logger.warn('Test warning');
    expect(warnSpy).toHaveBeenCalledWith('Test warning', undefined);
  });

  it('should call debug on the provided logger instance', () => {
    const logger = new AsenaLogger(mockWinstonInstance);
    const debugSpy = spyOn(mockWinstonInstance, 'debug');

    logger.debug('Test debug');
    expect(debugSpy).toHaveBeenCalledWith('Test debug', undefined);
  });

  it('should call log on the provided logger instance and not show winston warning', () => {
    const consoleWarnSpy = spyOn(console, 'warn');
    const logger = new AsenaLogger(mockWinstonInstance); // Inject our mock

    const logSpy = spyOn(mockWinstonInstance, 'log');

    logger.log('custom', 'Test custom log', { custom: true });

    expect(logSpy).toHaveBeenCalledWith('custom', 'Test custom log', { custom: true });

    // Since we are using a complete mock that doesn't know about Winston's internals,
    // the "Unknown logger level" warning should not appear.
    let winstonWarningFound = false;

    for (const callArgs of consoleWarnSpy.mock.calls) {
      if (typeof callArgs[0] === 'string' && callArgs[0].includes('[winston] Unknown logger level')) {
        winstonWarningFound = true;
        break;
      }
    }

    expect(winstonWarningFound).toBe(false);
    consoleWarnSpy.mockRestore();
  });

  it('should call profile on the provided logger instance', () => {
    const logger = new AsenaLogger(mockWinstonInstance);
    const profileSpy = spyOn(mockWinstonInstance, 'profile');
    const profileId = 'test-profile-id';

    logger.profile(profileId);
    expect(profileSpy).toHaveBeenCalledWith(profileId);
  });
});
