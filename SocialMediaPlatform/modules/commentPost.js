import Post from "./post.js";
async function addComment(req, res) {
  try {
    
    const { postId } = req.params;
    const { text } = req.body;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    post.comments.push({
  userId: req.user.id,
  username: req.user.username,
  text,
  createdAt: new Date()   // ✅ ADD THIS
});

    await post.save();
    const redirectTo = req.body.redirectTo;
    res.redirect(redirectTo || "/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding comment");
  }
}

export default addComment;