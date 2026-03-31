import fs from 'fs';
function likePost(req,res){
    try{
        let ID = req.params.id;
        let postId = Number(ID.slice(1));
        let userId = req.user;
        console.log(postId);
        console.log(userId);


        if(!postId || !userId){
            return res.status(400).send("All fields are required");
        }
        let posts = [];
        if (fs.existsSync("posts.json")) {
            posts = JSON.parse(fs.readFileSync("posts.json", "utf-8"));
            const post = posts.find(p => p.postId == postId);
           
            if (!post) {
                return res.status(404).send("Post not found");
            }
        
        
            if(!post.likes.includes(userId)){
                post.likes.push(userId);
            }
        }   
        fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
        res.status(200).send("like Added");    
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
export default likePost;