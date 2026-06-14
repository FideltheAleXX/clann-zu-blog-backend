import { postModel } from '../models/post.model.js';

export const postController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await postModel.getAll();

      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  getOnePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await postModel.getById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  createOnePost: async (req, res) => {
    try {
      const { title, content, img } = req.body;

      const author = req.user.id;

      if (!title || !content) {
        return res
          .status(400)
          .json({ message: 'Title and content are required fields' });
      }

      const newPost = await postModel.createPost({
        title,
        content,
        author,
        img,
      });

      res.status(201).json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  updateOnePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await postModel.getById(id);
      const fieldsToUpdate = req.body;
      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'Нет данных для обновления' });
      }

      const updatedPost = await postModel.updatePost(id, fieldsToUpdate);

      if (!updatedPost) {
        return res.status(404).json({ message: 'Пост не найден' });
      }

      res.json(updatedPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  deleteOnePost: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedPost = await postModel.deletePost(id);

      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json({ message: 'Post successfully deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
