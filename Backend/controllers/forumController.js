import ForumPost from '../models/ForumPost.js';
import ForumRequest from '../models/ForumRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadBase64ToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// Request forum access
export const requestForumAccess = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Please provide a reason for forum access' });
    }

    if (req.user.forumAccess) {
      return res.status(400).json({ success: false, message: 'You already have forum access' });
    }

    const existingRequest = await ForumRequest.findOne({
      user: req.user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending forum access request' });
    }

    const forumReq = await ForumRequest.create({
      user: req.user._id,
      reason
    });

    await User.findByIdAndUpdate(req.user._id, { forumAccessRequested: true });

    res.status(201).json({
      success: true,
      forumRequest: forumReq,
      message: 'Forum access request submitted. Admin will review shortly.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create forum post
export const createForumPost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const postData = {
      title,
      content,
      category: category || 'General',
      author: req.user._id,
      isAdminPost: req.user.role === 'admin',
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    if (image) {
      const result = await uploadBase64ToCloudinary(image, 'forum');
      postData.image = { public_id: result.public_id, url: result.url };
    }

    const post = await ForumPost.create(postData);
    await post.populate('author', 'name department profileImage');

    res.status(201).json({
      success: true,
      post,
      message: req.user.role === 'admin'
        ? 'Post published successfully'
        : 'Post submitted for admin approval'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all approved forum posts
export const getForumPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { status: 'approved' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await ForumPost.find(query)
      .populate('author', 'name department profileImage')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single forum post
export const getForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name department profileImage')
      .populate('comments.user', 'name profileImage')
      .populate('likes', 'name');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update forum post
export const updateForumPost = async (req, res) => {
  try {
    let post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, content, category, image } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;

    if (image) {
      if (post.image && post.image.public_id) {
        await deleteFromCloudinary(post.image.public_id);
      }
      const result = await uploadBase64ToCloudinary(image, 'forum');
      updateData.image = { public_id: result.public_id, url: result.url };
    }

    // If student updates, set back to pending
    if (req.user.role !== 'admin') {
      updateData.status = 'pending';
    }

    post = await ForumPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('author', 'name department profileImage');

    res.json({ success: true, post, message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete forum post
export const deleteForumPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (post.image && post.image.public_id) {
      await deleteFromCloudinary(post.image.public_id);
    }

    await ForumPost.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like/Unlike forum post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      content
    });

    await post.save();
    await post.populate('comments.user', 'name profileImage');

    res.status(201).json({
      success: true,
      comments: post.comments,
      message: 'Comment added'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.comments.pull(commentId);
    await post.save();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my forum posts
export const getMyForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};