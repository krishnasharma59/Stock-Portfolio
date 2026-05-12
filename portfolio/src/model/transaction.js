import mongoose from "../config/connection.db.js";

const transactionSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    stock_name:String,
    type:String,
    quantity:Number,
    price:Number,
    date:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model("Transaction",transactionSchema);