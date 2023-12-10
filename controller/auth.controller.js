import User from "../model/user.model.js"
import jwt  from "jsonwebtoken"
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js'




export const signup = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    console.log('generated salt:', salt);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = User({firstName, lastName, email, password: hashedPassword});
    console.log(newUser);


    try {
        await newUser.save();
        res.status(201).json('user created successfully')
    } catch (error) {
        console.log(error);
        next(error)
    }
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const valideUser = await User.findOne({email});
        if(!valideUser) return next(errorHandler (401, 'user not found'))
        const validePassword = bcryptjs.compareSync(password, valideUser.password);
        if(!validePassword) return next(errorHandler (401, 'wrong credentials'))

        const token = jwt.sign({id: valideUser._id }, process.env.JWT_SECRET);
        const {password: pass, ...rest} = valideUser._doc;

        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
};


 export const google = async (req, res, next) => {
try {
    const user = await User. findOne({ email: req.body.email});
    if (user) {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} =  user._doc
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)
    } else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
        const newUser = new User ({
            firstName : req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
            email: req.email,
            password: hashedPassword,
            image: reg.body.photo
        });
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
        const {password : pass, ...rest} = newUser._doc;
        res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest)
    }
    
} catch (error) {
    next(error)
}
};

export const signout = async (req, res, next) => {
try {
    res.clearCookie('access_token');
    res.status(200).json('user has been logged out!!')
    
} catch (error) {
    next(error)
}
}