/**
 * Simple logger utility for consistent logging across the application
 */
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, meta ? meta : '');
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta ? meta : '');
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, meta ? meta : '');
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, meta ? meta : '');
    }
  }
};
