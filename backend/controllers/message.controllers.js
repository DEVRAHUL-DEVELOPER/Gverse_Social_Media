import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";
import { encryptMessage, decryptMessage } from "../helpers/cryptoHelper.js";

// Send message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;
        let { message } = req.body;

        // Encrypt message before saving
        if (message) message = encryptMessage(message);

        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message,
            image
        });

        // Handle conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        // Emit real-time message to receiver
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                ...newMessage._doc,
                message: message ? decryptMessage(message) : ""
            });
        }

        return res.status(200).json({
            ...newMessage._doc,
            message: message ? decryptMessage(message) : ""
        });
    } catch (error) {
        return res.status(500).json({ message: `Send Message error: ${error}` });
    }
};

// Get all messages between two users
export const getAllMessages = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        const decryptedMessages = conversation?.messages.map(msg => ({
            ...msg._doc,
            message: msg.message ? decryptMessage(msg.message) : ""
        }));

        return res.status(200).json(decryptedMessages);
    } catch (error) {
        return res.status(500).json({ message: `Get Message error: ${error}` });
    }
};

// Get previous chats (user list)
export const getPrevUserChats = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const conversations = await Conversation.find({
            participants: currentUserId
        }).populate("participants").sort({ updatedAt: -1 });

        const userMap = {};
        conversations.forEach(conv => {
            conv.participants.forEach(user => {
                if (user._id.toString() !== currentUserId.toString()) {
                    userMap[user._id] = user;
                }
            });
        });

        return res.status(200).json(Object.values(userMap));
    } catch (error) {
        return res.status(500).json({ message: `Previous users error: ${error}` });
    }
};
