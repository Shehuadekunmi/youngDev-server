
import mongoose from "mongoose";

const userShecma = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        unique: true,
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
}, {timestamps: true}) 

const User = mongoose.model('User', userShecma)
export default User;