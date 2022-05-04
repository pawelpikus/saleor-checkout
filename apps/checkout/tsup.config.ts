import { defineConfig } from "tsup";
import cssModulesPlugin from "esbuild-css-modules-plugin";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";

const handleStyleInjection = (css: string, digest: string) => {
  const transformed = postcss([tailwindcss, autoprefixer, csso]).process(
    css
  ).css;

  return `
    const styleId = 'style_${digest}';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = \`${transformed}\`;
      document.head.appendChild(style);
    }
  `;
};

export default defineConfig({
  entry: ["src/Checkout.tsx"],
  format: ["esm"],
  noExternal: ["react", "react-dom", "@saleor/sdk"],
  dts: true,
  inject: ["./react-import.ts"],
  replaceNodeEnv: true,
  esbuildPlugins: [
    cssModulesPlugin({
      inject: handleStyleInjection,
    }),
  ],
});
