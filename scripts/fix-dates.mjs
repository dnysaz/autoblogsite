import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesRoot = path.join(__dirname, '../content/articles');

function getAllJsonFiles(dir, files_ = []) {
    if (!fs.existsSync(dir)) return files_;
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = path.join(dir, files[i]);
        if (fs.statSync(name).isDirectory()) {
            getAllJsonFiles(name, files_);
        } else if (name.endsWith('.json')) {
            files_.push(name);
        }
    }
    return files_;
}

const now = new Date().toISOString();
const allFiles = getAllJsonFiles(articlesRoot);

allFiles.forEach(file => {
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    // If date is before 2026, fix it
    if (new Date(content.publishedAt).getFullYear() < 2026) {
        content.publishedAt = now;
        fs.writeFileSync(file, JSON.stringify(content, null, 2));
        console.log(`✅ Fixed date for: ${path.basename(file)}`);
    }
});
