import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically clean up after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});

/**
 * Higher-order function to wrap components with multiple providers
 * @param providers - An array of React component providers
 * @returns A function that wraps children with the provided context providers
 */
export const withProviders = (providers: React.ComponentType<{ children: React.ReactNode }>[]) => {
  return function WithProvidersWrapper({ children }: { children: React.ReactNode }) {
    // Reduce the providers array to wrap the children with each provider
    return providers.reduce((prevChildren, Provider) => {
      return <Provider>{prevChildren}</Provider>;
    }, children);
  };
};
