import { spawn } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const intervalHours = parseFloat(process.env.GENERATE_INTERVAL_HOURS || '1');
const intervalMs = intervalHours * 60 * 60 * 1000;

function runGenerator(immediate = false) {
    if (!immediate) {
        console.log(`[${new Date().toISOString()}] 😴 Sleeping for ${intervalHours} hour(s)...`);
        setTimeout(() => runGenerator(true), intervalMs);
        return;
    }

    console.log(`[${new Date().toISOString()}] 🕒 Triggering article generation...`);
    
    const child = spawn('node', [path.join(__dirname, 'generate-article.mjs')], {
        stdio: 'inherit'
    });

    child.on('close', (code) => {
        if (code === 0) {
            console.log(`[${new Date().toISOString()}] ✅ Generation finished successfully.`);
        } else {
            console.error(`[${new Date().toISOString()}] ❌ Generation failed with code ${code}`);
        }
        
        runGenerator(false);
    });
}

// Initial check: Should we run immediately or wait?
const articlesDir = path.join(__dirname, '../content/articles');
let shouldRunNow = true;

function getAllFiles(dirPath, arrayOfFiles = []) {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.json')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

if (fs.existsSync(articlesDir)) {
    const files = getAllFiles(articlesDir);
    if (files.length > 0) {
        // Sort by file mtime to find truly latest
        const sortedFiles = files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
        const latestFile = sortedFiles[0];
        const stats = fs.statSync(latestFile);
        const lastRunTime = stats.mtime.getTime();
        const now = Date.now();
        
        if (now - lastRunTime < intervalMs) {
            shouldRunNow = false;
            const remainingMs = intervalMs - (now - lastRunTime);
            const remainingMins = Math.round(remainingMs / 60000);
            console.log(`[${new Date().toISOString()}] ℹ️ Recently generated. Waiting ${remainingMins} minutes before next run.`);
            setTimeout(() => runGenerator(true), remainingMs);
        }
    }
}

console.log(`🚀 Scheduler started. Interval: ${intervalHours} hour(s)`);
if (shouldRunNow) {
    runGenerator(true);
}
