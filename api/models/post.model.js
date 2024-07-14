import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    content:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required:true,
        unique:true
    },
    image:{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAG-_UwX5Bvcu_r1ohyQfKlF__iINs5zlaK-ZUKU1y07stmL_RAf1fXTYW2ci_MwO0AtM&usqp=CAU"
    },
    category:{
        type: String,
        default:"uncategorized"
    },
    slug:{
        type: String,
        required:true,
        unique:true
    }
},{timestamps:true})

const Post = mongoose.model("post",postSchema);
export default Post;