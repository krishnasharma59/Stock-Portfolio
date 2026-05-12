import { StatusCodes } from "http-status-pro-js";
import Stock from "../model/portfolio.js";
import Transaction from "../model/transaction.js";


//adding stock
export async function addstock(req,res){
        
    let {stock_name,quantity,buy_price,current_price} = req.body;

    try{

        if(!stock_name || !quantity || !buy_price || !current_price){
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:"All fields are required",
                data:null
            })
        }



        let exist = await Stock.findOne({stock_name});

        if(exist){
            return res.status(StatusCodes.CONFLICT.code).json({
                code:StatusCodes.CONFLICT.code,
                message:"Stock already exists",
                data:null
            })
        }

        let obj = new Stock({stock_name,quantity,buy_price,current_price});

        await obj.save()
        .then(()=>{
            return res.status(StatusCodes.CREATED.code).json({
                code:StatusCodes.CREATED.code,
                message:StatusCodes.CREATED.message,
                data:null
            })
        })
        .catch((err)=>{
            console.log(err);
        })

    }catch(err){
        console.log("create ",err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code:StatusCodes.INTERNAL_SERVER_ERROR.code,
            message:StatusCodes.INTERNAL_SERVER_ERROR.message,
            data:null
        })
    }
}


//update stock
// Updating Stock qty.
export async function updateStockQuantity(req, res) {

    let { stock_name, quantity } = req.body;

    try {

        if (!stock_name || !quantity) {
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code: StatusCodes.BAD_REQUEST.code,
                message: "Stock name and quantity are required",
                data: null
            })
        }

        let exist = await Stock.findOne({ stock_name });

        if (!exist) {
            return res.status(StatusCodes.NOT_FOUND.code).json({
                code: StatusCodes.NOT_FOUND.code,
                message: "Stock not found",
                data: null
            })
        }

        await Stock.updateOne(
            { stock_name },
            { $set: { quantity } }
        )
        .then(() => {
            return res.status(StatusCodes.OK.code).json({
                code: StatusCodes.OK.code,
                message: "Stock quantity updated successfully",
                data: null
            })
        })
        .catch((err) => {
            console.log(err);
        })

    } catch (err) {
        console.log("update ", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR.code,
            message: StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}


// delete stock
export async function deleteStock(req, res) {

    let { stock_name } = req.body;

    try {

        if (!stock_name) {
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code: StatusCodes.BAD_REQUEST.code,
                message: "Stock name is required",
                data: null
            })
        }

        let exist = await Stock.findOne({ stock_name });

        if (!exist) {
            return res.status(StatusCodes.NOT_FOUND.code).json({
                code: StatusCodes.NOT_FOUND.code,
                message: "Stock not found",
                data: null
            })
        }

        await Stock.deleteOne({ stock_name })
        .then(() => {
            return res.status(StatusCodes.OK.code).json({
                code: StatusCodes.OK.code,
                message: "Stock deleted successfully",
                data: null
            })
        })
        .catch((err) => {
            console.log(err);
        })

    } catch (err) {
        console.log("delete ", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR.code,
            message: StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}



// stock sell krne k liye
export async function sellStock(req, res) {

    let { stock_name, quantity } = req.body;

    try {

        if (!stock_name || !quantity) {
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code: StatusCodes.BAD_REQUEST.code,
                message: "Stock name and quantity are required",
                data: null
            })
        }

        let exist = await Stock.findOne({ stock_name });

        if (!exist) {
            return res.status(StatusCodes.NOT_FOUND.code).json({
                code: StatusCodes.NOT_FOUND.code,
                message: "Stock not found",
                data: null
            })
        }

        if (exist.quantity < quantity) {
            return res.status(StatusCodes.BAD_REQUEST.code).json({
                code: StatusCodes.BAD_REQUEST.code,
                message: "Not enough stock quantity to sell",
                data: null
            })
        }

        let remainingQty = exist.quantity - quantity;

        // delete qty from stock collection if zero
        if (remainingQty === 0) {
            await Stock.deleteOne({ stock_name });
        } else {
            await Stock.updateOne(
                { stock_name },
                { $set: { quantity: remainingQty } }
            );
        }

        return res.status(StatusCodes.OK.code).json({
            code: StatusCodes.OK.code,
            message: "Stock sold successfully",
            data: null
        })

    } catch (err) {
        console.log("sell ", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR.code,
            message: StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}


// transaction history generate
export async function getTransactionHistory(req, res) {

    try {

        let data = await Transaction.find().sort({ createdAt: -1 });

        return res.status(StatusCodes.OK.code).json({
            code: StatusCodes.OK.code,
            message: "Transaction history fetched successfully",
            data: data
        })

    } catch (err) {
        console.log("history ", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR.code,
            message: StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}
