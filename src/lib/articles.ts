import fs from 'fs';
import path from 'path';

export interface Article {
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  coverImage: string;
  coverImageCredit?: string;
  publishedAt: string;
  isPinned?: boolean;
}

export function getAllArticleFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllArticleFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.json')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

export function getArticles(): Article[] {
  const articlesDir = path.join(process.cwd(), 'content', 'articles');
  const files = getAllArticleFiles(articlesDir);
  
  const allArticles = files.map(file => JSON.parse(fs.readFileSync(file, 'utf-8')));

  return allArticles.sort((a, b) => {
    // Pin logic: true comes before undefined/false
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by date
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}
