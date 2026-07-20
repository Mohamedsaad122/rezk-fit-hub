import { build } from 'vite';
import fs from 'fs';

console.log("Starting build...");
try {
    await build({
        logLevel: 'info',
    });
    console.log("Build successful!");
} catch (e) {
    console.error("Build failed!");
    fs.writeFileSync('build_error.log', e.stack || e.message || JSON.stringify(e));
}
