import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split("")[1];
    const isCustomAuth = token.length < 500; // greater than 500 is google token

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.secret);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; //sub is google way to differentiate users based on user IDs
    }
  } catch (error) {
    console.log(error);
  }
};
export default auth;
