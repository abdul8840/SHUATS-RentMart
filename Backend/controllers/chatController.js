import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { uploadBase64ToCloudinary } from '../config/cloudinary.js';

// Create or get chat
export const createOrGetChat = async (req, res) => {
  try {
    const { participantId, itemId } = req.body;

    if (participantId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });
    }

    // Check for existing chat
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      ...(itemId && { item: itemId })
    })
      .populate('participants', 'name profileImage department trustScore')
      .populate('item', 'title images price')
      .populate('lastMessage');

    if (chat) {
      return res.json({ success: true, chat });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.user._id, participantId],
      item: itemId || undefined
    });

    chat = await Chat.findById(chat._id)
      .populate('participants', 'name profileImage department trustScore')
      .populate('item', 'title images price');

    res.status(201).json({ success: true, chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's chats
export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
      .populate('participants', 'name profileImage department trustScore')
      .populate('item', 'title images price')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    // Count unread messages for each chat
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user._id },
          isRead: false
        });
        return { ...chat.toObject(), unreadCount };
      })
    );

    res.json({ success: true, chats: chatsWithUnread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType, image } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not a participant of this chat' });
    }

    const messageData = {
      chat: chatId,
      sender: req.user._id,
      content,
      messageType: messageType || 'text'
    };

    if (messageType === 'image' && image) {
      const result = await uploadBase64ToCloudinary(image, 'chat-images');
      messageData.imageUrl = { public_id: result.public_id, url: result.url };
    }

    const message = await Message.create(messageData);
    await message.populate('sender', 'name profileImage');

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageAt = Date.now();
    await chat.save();

    // Emit socket event
    if (req.io) {
      req.io.to(chatId).emit('receive_message', message);
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chat: chatId });

    // Mark messages as read
    await Message.updateMany(
      { chat: chatId, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.json({
      success: true,
      messages: messages.reverse(),
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

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id });
    const chatIds = chats.map(c => c._id);

    const unreadCount = await Message.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: req.user._id },
      isRead: false
    });

    res.json({ success: true, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};