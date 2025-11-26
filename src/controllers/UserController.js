import connect from "../config/db.js";
import * as UserModel from "../models/UserModel.js"

export const register = async (req, res, next) =>{
    const {name, email, password} = req.body;
    
    //get Connection
    const conn = await connect();
    try{
        const user = await UserModel.createUser(name, email, password, conn);
        await conn.end();
        res.status(201).json({
            success: true,
            message: [
                {result: "A new account has been created!"}
            ]
        });
    }catch(e){
        await conn.end();
        next(e);
    }
}

export const login = async (req, res, next) =>{
    const {email, password} = req.body;

    //get Connection
    const conn = await connect();
    try{
        const token = await UserModel.login(email, password, conn);
        await conn.end();
        res.status(200).json({
            success: true,
            message: [
                {result: "Login successful!"},
                token
            ]
        });
    }catch(e){
        await conn.end();
        next(e);
    }
}