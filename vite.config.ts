/* eslint-env node */
import { resolve } from "path";
import { defineConfig } from "viteburner";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "/src": resolve(__dirname, "src"),
        },
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        minify: false,
    },
    viteburner: {
        watch: [
            { pattern: "src/**/*.{js,ts}", transform: true },
            { pattern: "src/**/*.{script,txt}" },
        ],
        sourcemap: "inline",
    },
});
