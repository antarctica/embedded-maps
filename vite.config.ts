/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    plugins: [react({ tsDecorators: true }), TanStackRouterVite(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    test: {
      globals: true,
      setupFiles: './src/test/setup.tsx',
      environment: 'jsdom',
      dir: './src',
      restoreMocks: true,
    },
    base: env.VITE_BASE_PATH,
    server: {
      host: true, // needed for docker
      port: 5173,
    },
  });
};
