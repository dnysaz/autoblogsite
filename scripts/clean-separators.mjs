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
    let data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    let content = data.content;
    
    // Remove "---" or "--" separators (Markdown horizontal rules or AI artifacts)
    const originalContent = content;
    content = content.replace(/^(\s*[-*_]){3,}\s*$/gm, ''); // Markdown horizontal rules
    content = content.replace(/\n\s*--+\s*\n/g, '\n\n'); // Decorative double dashes

    if (content !== originalContent) {
        data.content = content;
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.log(`✅ Cleaned separators in: ${path.relative(process.cwd(), file)}`);
        count++;
    }
});

console.log(`\n🎉 Total articles cleaned: ${count}`);
