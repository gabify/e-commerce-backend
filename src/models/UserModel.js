import pool from "../config/db.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import tokenGenerator from "../utils/tokenGenerator.js";

export const getUser = async (id) =>{
    if(parseInt(id) === NaN){
        throw new Error('Invalid id');
    }

    const [user] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    return user;
}

export const createUser = async (name, email, password) =>{
    if(name.trim() === '' || email.trim() === '' || password.trim() === ''){
        const error = new TypeError('Name, Email and Password are required.')
        error.statusCode = 400;
        throw error;
    }

    if(!validator.isEmail(email)){
        const error = new TypeError('Invalid email address.')
        error.statusCode = 400;
        throw error;
    }

    if(!validator.isStrongPassword(password)){
        const error = new TypeError('Password is not strong enough.')
        error.statusCode = 400;
        throw error;
    }

    const [user] = await pool.query("SELECT email FROM user WHERE email = ?", [email]);
    
    if(user.length === 1){
        const error = new Error(`The email ${email} is alredy used.`)
        error.statusCode = 400;
        throw error;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const [newUser] = await pool.query("INSERT INTO user(name, email, password) VALUES(?,?,?)", [name, email, hashedPassword]);

    return newUser;
}

export const login = async (email, password) =>{
    if(email === '' || password === ''){
        throw new Error('Email and Password is required');
    }

    const [user] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);

    if(user.length === 0){
        throw new Error(`An acccount with email: ${email} does not exist.`);
    }

    if(!bcrypt.compareSync(password, user[0].password)){
        throw new Error('Incorrect password');
    }

    //generate and return token
    return tokenGenerator(user[0].id);
}