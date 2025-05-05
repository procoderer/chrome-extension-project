import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest-and-assets',
      buildEnd() {
        // Ensure dist directory exists
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
        }
        
        // Copy manifest.json
        copyFileSync('public/manifest.json', 'dist/manifest.json');
        
        // Copy background.js
        copyFileSync('public/background.js', 'dist/background.js');
        
        // Copy images folder (recursive copy not implemented here, 
        // you may need to enhance this for complex directory structures)
        if (!existsSync('dist/images')) {
          mkdirSync('dist/images', { recursive: true });
        }
        // You would need to copy each image individually here
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:     resolve(__dirname, "index.html"),
        sidepanel: resolve(__dirname, "sidepanel.html"),
      },
    },
  },
}); 
