import * as UserModel from "../models/UserModel.js"


export const register = async (req, res, next) =>{
    const {name, email, password} = req.body;

    try{
        const user = await UserModel.createUser(name, email, password);
        res.status(201).json({
            success: true,
            message: [
                {result: "A new account has been created!"}
            ]
        });
    }catch(e){
        next(e);
    }
}

export const login = async (req, res, next) =>{
    const {email, password} = req.body;

    try{
        const token = await UserModel.login(email, password);
        res.status(200).json({
            success: true,
            message: [
                {result: "Login successful!", token},
            ]
        });
    }catch(e){
        next(e);
    }
}