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
    const oldTitle = data.title;
    
    // Skip vision/technical posts
    if (file.includes('pinned-vision') || file.includes('how-it-works-technical')) return;

    // Remove "in 2026", "for 2026", "by 2026", "2026", "2030", "2025" etc.
    let newTitle = oldTitle
        .replace(/\s(in|for|by|at|beyond)\s202[0-9]/gi, '')
        .replace(/\s(in|for|by|at|beyond)\s203[0-9]/gi, '')
        .replace(/\s202[0-9]/g, '')
        .replace(/\s203[0-9]/g, '')
        .replace(/\s(in|for|by|at|beyond|and)$/gi, '') // Remove trailing prepositions/conjunctions
        .replace(/\s\s+/g, ' ')
        .trim();

    if (newTitle !== oldTitle) {
        console.log(`Old Title: ${oldTitle}`);
        console.log(`New Title: ${newTitle}`);
        data.title = newTitle;
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        count++;
    }
});

console.log(`\n🎉 Total titles cleaned of years: ${count}`);
