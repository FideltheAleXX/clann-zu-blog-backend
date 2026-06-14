import express from 'express';

export const xmlRouter = express.Router();
// Маршрут для sitemap.xml
xmlRouter.get('/sitemap.xml', async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');

    const result = await db.query(
      'SELECT id FROM posts ORDER BY created_at DESC',
    );
    const posts = result.rows; // Получаем массив объектов, например: [{id: 1}, {id: 2}]

    // 3. Начинаем собирать XML-строку
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    xml += `
      <url>
        <loc>https://clann-zu.com/</loc>
        <priority>1.0</priority>
      </url>
       <url>
        <loc>https://clann-zu.com/albums/</loc>
        <priority>1.0</priority>
      </url>
       <url>
        <loc>https://clann-zu.com/blog</loc>
        <priority>1.0</priority>
      </url>
       <url>
        <loc>https://clann-zu.com/about</loc>
        <priority>1.0</priority>
      </url>
       <url>
        <loc>https://clann-zu.com/auth</loc>
        <priority>1.0</priority>
      </url>
       <url>
        <loc>https://clann-zu.com/create-post</loc>
        <priority>1.0</priority>
      </url>
       <url>
        <loc>https://clann-zu.com/posts</loc>
        <priority>1.0</priority>
      </url>`;

    // 4. Динамически перебираем альбомы из базы и добавляем их в карту сайта
    posts.forEach((post) => {
      xml += `
        <url>
          <loc>https:clann-zu.com/posts/${post.id}</loc>
          <priority>0.8</priority>
        </url>
      `;
    });

    xml += `</urlset>`;

    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});
