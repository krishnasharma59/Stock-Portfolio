import Post from "./post.js";
async function postAdd(req,res){
    try{
        let {imageURL,title,description} = req.body;
        let userId = req.user.id;
        if(!userId){
            return res.status(400).send("User ID Required");
        }
        if(!title || !description){
            return res.status(400).send("All Fields Required");
        }
        const newPost = new Post({
            userId,
            title,
            description,
            imageURL: imageURL || ""
        });

        await newPost.save();

        res.redirect("/dashboard");

    }   
    catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}
export default postAdd;