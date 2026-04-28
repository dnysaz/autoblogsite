import fs from 'fs';
import path from 'path';

const articlesRoot = path.join(process.cwd(), 'content', 'articles');

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

const allFiles = getAllJsonFiles(articlesRoot);
let count = 0;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    if (content.includes('2025')) {
        const updatedContent = content.replace(/2025/g, '2026');
        fs.writeFileSync(file, updatedContent);
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        count++;
    }
});

console.log(`\n🎉 Total files fixed: ${count}`);
