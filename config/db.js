import mongoose from "mongoose"

const connectMongoDB = async() => {
    try {
        await mongoose.connect(process.env.URI_MONGODB);
        console.log("conectado con MongoDB Atlas!");
        
    } catch (error) {
        console.log("error con conectar con mongoDB");
        
    }
};

export default connectMongoDB;