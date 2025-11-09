import express from "express";
import 'dotenv/config.js';
import { errorHandler } from "./middleware/errorHandler.js";
import {fileURLToPath} from "url";
import path from "path";

//Routers
import productRoutes from "./src/routers/ProductRoutes.js";
import categoryRouters from "./src/routers/CategoryRoutes.js";

//initialize the app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//add Middlewares here
app.use(express.json());

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

//server upload folder
app.use('/product/thumbnails', express.static(path.join(__dirname, "thumbnails")))

//Global error handler
app.use(errorHandler);


//if no request matches the endpoints from the user
//This endpoint will send a 404 not found error to the client
app.use((req, res) =>{
    res.status(404).json({suucess: false, message: 'No such endpoint exists'});
});