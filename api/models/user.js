const mongoose=require('mongoose')
const {Schema,model}=mongoose;


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [4, 'Username must be at least 4 characters long'],
        unique: [true, 'Each user must have a unique username']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long']
    }
});

const UserModel=model('User',UserSchema);

module.exports =UserModel;