/// <reference types="vitest" />
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
    test: {
      globals: true,
      setupFiles: './src/test/setup.tsx',
      environment: 'jsdom',
    },
    base: env.VITE_BASE_PATH,
    server: {
      host: true, // needed for docker
      port: 5173,
    },
  });
};
