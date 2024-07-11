const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema(
    {username: 
        {type: String, unique:true, required: true},
    password: {type: String, required:true},
    correctAnswerStreak: {type:Number, default:0}
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")){
        this.password = await argon2.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (err) {
        throw new Error(err);
    }
};

const User = mongoose.model("User", userSchema, "users");
module.exports = User;