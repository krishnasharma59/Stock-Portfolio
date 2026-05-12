import mongoose from "../config/connection.db.js";

const portfolioSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    stock_name:String,
    quantity:Number,
    buy_price:Number,
    current_price:Number
});

export default mongoose.model("stock",portfolioSchema);