import Post from "./post.js";

async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }
    post.comments.splice(commentId, 1);

    await post.save();

    res.redirect("/dashboard");

  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting comment");
  }
}

export default deleteComment;