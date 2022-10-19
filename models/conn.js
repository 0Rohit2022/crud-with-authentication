const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const PlaylistSchema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const schema = new PlaylistSchema({
        firstname:{
            type:String,
            required:true,
        
        },
        lastname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        gender:{
            type:String,
            required:true,
           
        },
        phone:{
            type:Number,
            required:true,
           
        },
        age:{
            type:Number,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        confirmpassword:{
            type:String,
            required:true,
        },
        tokens:[{
            token:{
                type:String,
                required:true,
            }
        }]

})

    schema.methods.generateAuthToken = async function() {
        try {
            console.log(this._id)
            const token = jwt.sign({_id:this._id.toString()},process.env.SECRET)
            this.tokens= this.tokens.concat({token:token})
            await this.save();
            return token;
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

schema.pre("save", async function(next) {
    if(this.isModified("password")){
        // console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password,12);
        // console.log(`The current password is ${this.password}`);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,12);
    }
    next();
})
// In the above section the code is determining the middleware functions 
// which means after getting the data but before storing it there is a fucntion
//  which we caled middleware
// In the above code pre is like for eg. board main exam dene se pehle hallticket check
// hota hain waise hi hain pre 
// toh woh check kar raha hain save method 
// and this.ismodified is used for only and only if password is modified and or an user
// enters the data then and only then it wil perfrom the bcryptjs 
// so suppose you are writing vinod then in your database it will submit in another format
// because it is fully encrypted by hashing algorithm

module.exports = mongoose.model("Register", schema);


