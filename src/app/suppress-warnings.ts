'use client';

if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('params') && args[0].includes('Promise')) ||
      (args[0].includes('searchParams') && args[0].includes('Promise'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('params') && args[0].includes('Promise')) ||
      (args[0].includes('searchParams') && args[0].includes('Promise'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export { };
