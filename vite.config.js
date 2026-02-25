import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                loadPaths: [resolve(__dirname, "src/styles")],
            },
        },
    },
    
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                SASS: resolve(__dirname, "sass.html"),
                Animation: resolve(__dirname, "animation.html")
            },
        },
    },
});