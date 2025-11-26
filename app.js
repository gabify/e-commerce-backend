import express from "express";
import 'dotenv/config.js';
import { errorHandler } from "./src/middleware/errorHandler.js";
import {fileURLToPath} from "url";
import path from "path";
import cors from "cors";

//Routers
import productRoutes from "./src/routers/ProductRoutes.js";
import categoryRouters from "./src/routers/CategoryRoutes.js";
import userRoutes from "./src/routers/UserRoutes.js";
import cartRouter  from "./src/routers/CartRoutes.js";
import orderRouter from "./src/routers/OrderRoutes.js";

//initialize the app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Enable cors to frontend
let corsOptions = {
    origin: process.env.ORIGIN
}

//add Middlewares here
app.use(express.json());
app.use(cors(corsOptions));

//This is used to log the request on the console
app.use((req, res, next) =>{
    console.log(req.path, req.method);
    next();
})


//Start the app
try{
    app.listen(process.env.PORT || 3000, () =>{
        console.log(`Listening to port ${process.env.PORT || 3000}...`);
    })
}catch(e){
    console.log(e);
}

app.use('/product', productRoutes);
app.use('/category', categoryRouters);
app.use('/user', userRoutes);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

//server upload folder
app.use('/product/thumbnails', express.static(path.join(__dirname, "thumbnails")))

//Global error handler
app.use(errorHandler);


//if no request matches the endpoints from the user
//This endpoint will send a 404 not found error to the client
app.use((req, res) =>{
    res.status(404).json({suucess: false, message: 'No such endpoint exists'});
});