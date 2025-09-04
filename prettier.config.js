/** @type {import("prettier").Config} */
export default {
  // Core formatting options
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  endOfLine: "lf",

  // JSX specific options
  jsxSingleQuote: false,

  // Plugin configurations
  plugins: ["prettier-plugin-tailwindcss"],

  // Tailwind CSS plugin options
  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx", "cn", "cva"],
};
