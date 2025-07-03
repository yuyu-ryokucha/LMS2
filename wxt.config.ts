import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  srcDir: 'src', // 追加
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // https://github.com/wxt-dev/examples/tree/main/examples/react-shadcn
      },
    },
  }),
  manifest: {
    permissions: ['sidePanel'],
  },
});
