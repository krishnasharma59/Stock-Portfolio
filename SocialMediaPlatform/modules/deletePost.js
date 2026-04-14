import Post from "./post.js";

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).send("Not found");

        if (post.userId.toString() !== userId) {
            return res.status(403).send("Unauthorized");
        }

        await Post.findByIdAndDelete(postId);

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export default deletePost;