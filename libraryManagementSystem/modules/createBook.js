
import logger from "../logger/logger.js";
import {StatusCodes} from "http-status-pro-js"
import User from "../server.js"
async function createBook(req, res) {
  try {
    const { title,author,price} = req.body;

    if (!title || !author || !price) {
      return res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:StatusCodes.BAD_REQUEST.message,
                data:null
            })
    }
    const bookName = await User.find({title:title});
    console.log(bookName);
    if(bookName.length>0){
        return res.status(StatusCodes.BAD_REQUEST.code).json({
                code:StatusCodes.BAD_REQUEST.code,
                message:StatusCodes.BAD_REQUEST.message,
                data:null
            })
    }
    const newBook = {
      title,
      author,
      price

    };

    await User.create(newBook);
    console.log(newBook);

    res.status(StatusCodes.ACCEPTED.code).json({
                code:StatusCodes.ACCEPTED.code,
                message:StatusCodes.ACCEPTED.message,
                data:newBook
            })

  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
                code:StatusCodes.INTERNAL_SERVER_ERROR.code,
                message:StatusCodes.INTERNAL_SERVER_ERROR.message,
                data:null
            })
  }
}

export default createBook;
