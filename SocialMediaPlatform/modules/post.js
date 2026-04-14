import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    imageURL: {
        type: String,
        required: true
    },
    title: String,
    description: String,
    likes: [{ type: String }],
    comments: [
    {
        userId: String,
        username: String,   // ✅ ADD THIS
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
]
    
}, { timestamps: true });

export default mongoose.model("Post", postSchema);