import { prisma } from '../config/db.js';

export const postModel = {
  getAll: async () => {
    const posts = await prisma.posts.findMany({
      orderBy: { id: 'desc' },
      include: { users: { select: { nickname: true } } },
    });

    return posts.map((p) => {
      const { users, ...rest } = p;
      return { ...rest, author: users?.nickname ?? null };
    });
  },
  getById: async (id) => {
    const post = await prisma.posts.findUnique({
      where: { id: Number(id) },
      include: { users: { select: { nickname: true } } },
    });

    if (!post) return null;
    const { users, ...rest } = post;
    return { ...rest, author: users?.nickname ?? null };
  },
  createPost: async ({ title, content, author, img }) => {
    const post = await prisma.posts.create({
      data: {
        title,
        content,
        user_id: author ? Number(author) : null,
        img: img ?? null,
      },
      include: { users: { select: { nickname: true } } },
    });

    const { users, ...rest } = post;
    return { ...rest, author: users?.nickname ?? null };
  },
  updatePost: async (id, fields) => {
    const data = {};
    for (const [key, value] of Object.entries(fields || {})) {
      if (value === undefined) continue;
      if (key === 'author') {
        data.user_id = value !== null ? Number(value) : null;
      } else {
        data[key] = value;
      }
    }

    if (Object.keys(data).length === 0) return null;

    const post = await prisma.posts.update({
      where: { id: Number(id) },
      data,
      include: { users: { select: { nickname: true } } },
    });

    const { users, ...rest } = post;
    return { ...rest, author: users?.nickname ?? null };
  },
  deletePost: async (id) => {
    const post = await prisma.posts.delete({
      where: { id: Number(id) },
      include: { users: { select: { nickname: true } } },
    });

    const { users, ...rest } = post;
    return { ...rest, author: users?.nickname ?? null };
  },
};
