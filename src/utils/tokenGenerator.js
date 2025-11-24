import jwt from "jsonwebtoken";

const tokenGenerator = (id) =>{
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '1d'});
}

export default tokenGenerator;