import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react-router-dom") || id.includes("react-router") || id.includes("@remix-run")) {
                            return "vendor-router";
                        }
                        if (id.includes("react-dom") || id.includes("react")) {
                            return "vendor-react";
                        }
                        if (id.includes("framer-motion")) {
                            return "vendor-framer";
                        }
                        if (id.includes("recharts")) {
                            return "vendor-charts";
                        }
                        if (id.includes("lucide-react")) {
                            return "vendor-lucide";
                        }
                        if (id.includes("@radix-ui")) {
                            return "vendor-radix";
                        }
                        return "vendor-others";
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(process.cwd(), "./src"),
        },
    },
}));
