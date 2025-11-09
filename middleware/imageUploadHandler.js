import multer from "multer";
import path from "path";
import fs from "fs";


//Define storage location
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = "thumbnails/";

        if(!fs.existsSync(destination)){
            fs.mkdirSync(destination, {recursive: true});
        }

        cb(null, destination);
    },
    filename : (req, file, cb) => {
        cb(null,`product-${Date.now()}${path.extname(file.originalname)}`)
    },
});

//File filter
const fileFilter = (req, file, cb) =>{
    const allowed = /jpeg|jpg|png|webp/;
    const extName = path.extname(file.originalname).toLowerCase();

    if(allowed.test(extName)){
        cb(null, true);
    }else{
        cb(new Error("Only images are allowed"), false);
    }
};


const imageUploadHandler = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024},
});

export default imageUploadHandler;