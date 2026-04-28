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
    let content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (content.title && content.title.includes(':')) {
        console.log(`Old Title: ${content.title}`);
        // Replace colon with a space (and handle double spaces)
        content.title = content.title.replace(/:/g, '').replace(/\s\s+/g, ' ').trim();
        console.log(`New Title: ${content.title}`);
        
        fs.writeFileSync(file, JSON.stringify(content, null, 2));
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        count++;
    }
});

console.log(`\n🎉 Total titles fixed: ${count}`);
