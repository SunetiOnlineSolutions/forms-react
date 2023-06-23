import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
// define config that takes App.tsx as entry point
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        forms: path.resolve(__dirname, './src/Compiler.tsx')
      },
      output: {
        dir: path.resolve(__dirname, './dist'),
        entryFileNames: '[name].js',
        format: 'esm',
        assetFileNames: 'forms[extname]',
      },
      // add the following code to change the name of the compiled CSS file
      plugins: [
        {
          name: 'rename-css-plugin',
          generateBundle(_, bundle) {
            for (const fileName in bundle) {
              if (fileName.endsWith('.css')) {
                const file = bundle[fileName];
                const newFileName = 'forms.css';
                delete bundle[fileName];
                bundle[newFileName] = file;
              }
            }
          }
        }
      ]
    }
  }
})
