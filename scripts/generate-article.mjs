import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API;
const CATEGORIES_RAW = process.env.ARTICLE_CATEGORIES || "Technology, Artificial Intelligence, Programming";
const CATEGORIES = CATEGORIES_RAW.split(',').map(c => c.trim());

async function generateArticle() {
    console.log("🚀 Starting article generation...");

    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

    // Get existing slugs recursively for internal linking
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

    let existingLinks = "";
    const allFiles = getAllJsonFiles(articlesRoot);
    if (allFiles.length > 0) {
        const slugs = allFiles.map(f => {
            const content = JSON.parse(fs.readFileSync(f, 'utf-8'));
            return { title: content.title, slug: `/blog/${content.slug}` };
        });
        // Limit to 10 random articles to not bloat the prompt
        const shuffled = slugs.sort(() => 0.5 - Math.random()).slice(0, 10);
        existingLinks = shuffled.map(s => `[${s.title}](${s.slug})`).join(', ');
    }

    const now = new Date();
    const currentYear = now.getFullYear();

    const systemPrompt = `You are a professional blog writer. The current year is ${currentYear}. Write a high-quality, engaging, and SEO-friendly blog article about ${category}. 
    Output the article strictly in JSON format with the following keys:
    - title: An eye-catching, SEO-optimized title. IMPORTANT: Do NOT use colons (:) in the title.
    - slug: A URL-friendly slug based on the title
    - category: The category provided (${category})
    - content: The full article content in Markdown format. 
      IMPORTANT RULES:
      1. Do NOT include the article title in the content markdown.
      2. Since this is a long article, you MUST naturally include 2 to 3 internal links to some of these existing articles: ${existingLinks}.
      3. Use professional headings, bullet points, and strong storytelling.
    - excerpt: A compelling 2-line meta description for SEO.
    - coverImage: A high-quality Unsplash image URL. Format: https://images.unsplash.com/photo-[RANDOM_ID]?auto=format&fit=crop&w=1200&q=80.
    - coverImageCredit: The photographer's name from Unsplash (if known) or simply "Unsplash Photographer".

    Ensure the JSON is valid and the content is extensive (min 800 words).`;

    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant that outputs only JSON." },
                    { role: "user", content: systemPrompt }
                ],
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
        }

        if (!data.choices || data.choices.length === 0) {
            throw new Error(`Invalid API response: ${JSON.stringify(data)}`);
        }

        const articleJson = JSON.parse(data.choices[0].message.content);

        // Set date manually to avoid AI hallucination
        const now = new Date();
        articleJson.publishedAt = now.toISOString();

        // Create date-based folder: DD-MM-YYYY
        const dateFolder = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        const articlesDir = path.join(process.cwd(), 'content', 'articles', dateFolder);
        
        if (!fs.existsSync(articlesDir)) {
            fs.mkdirSync(articlesDir, { recursive: true });
        }

        // Ensure filename is unique
        const timestamp = Date.now();
        const fileName = `article-${timestamp}.json`;
        const filePath = path.join(articlesDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(articleJson, null, 2));

        console.log(`✅ Article generated and saved: ${dateFolder}/${fileName}`);
    } catch (error) {
        console.error("❌ Error generating article:", error);
    }
}

generateArticle();
