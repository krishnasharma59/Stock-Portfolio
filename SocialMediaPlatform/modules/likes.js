import Post from "./post.js";

async function likePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // ✅ If likes array doesn't exist → create it
    if (!post.likes) {
      post.likes = [];
    }

    // ✅ Toggle like
    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    // ✅ IMPORTANT: return JSON (for no reload)
    res.json({
      likes: post.likes.length
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error liking post");
  }
}

export default likePost;