const express = require("express");
const register = require("../models/conn")
const Router = express.Router();
const bcrypt = require('bcryptjs');
const auth  = require('../middleware/auth')

Router.get("/", (req, res) => {
    res.render('index'); 
})

Router.get('/login', (req, res) => {
    res.render('login')
})

Router.get('/logout', auth, async(req,res) => {
    try{
        // for single logout
        // req.user.tokens = req.user.tokens.filter((Currelem) => {
        //     return Currelem.token != req.token
        // })

        // logout from all devices
        req.user.tokens = [];
        res.clearCookie('jwt');

        console.log('logout successfully')
       await req.user.save()
       res.render('login')
    }catch(error){
        res.status(500).res.send(error);
    }
})

Router.get('/show',auth, (req, res) => {
    // console.log(`The awesome cookies is ${req.cookies.jwt}`);
    register.find((err, docs) => {

        if (err) {
            console.log(err)
        }
        console.log(docs)
        res.render('show', {
            users: docs
        })

    })

})
Router.get('/edit', (req,res) => {
    res.render('edit');
}) 

Router.get('/edit/:id', (req,res) => {
    register.findOneAndUpdate({_id:req.params.id}, req.body,{new:true}, (err,docs) => {
        if(err) {
            res.send(err)
        }
        else {
            res.render('edit', { user : docs })
        }
    })
})
Router.post('/edit/:id', (req,res) => {
    register.findByIdAndUpdate({_id:req.params.id}, (req.body),  (err,docs) => {
        if(err){
            res.send(err)
        }
        else {
            res.redirect('/show');
        }
    })
})

Router.get('/delete/:id', (req,res) => {
    register.findByIdAndDelete({_id:req.params.id}, req.body, (err,docs) => {
        if(err){
            res.send(err);
        }
        else {
            console.log("Deleted Successfuly");
            res.redirect('/show');
        }
    })
})


Router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
       
       
        

        const registerrd = await register.findOne({ email: email });
        // this email:email will check first email is an email which is stored in database and second one is the user one and if both value are same then it will return the data of that email 
        console.log(registerrd)
        // console.log(registerrd.password)

        const isMatch = await bcrypt.compare(password, registerrd.password);

        // Middlware    
        const token = await registerrd.generateAuthToken();
        console.log("The token part is" + token);
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60000),
            httpOnly:true,
        })

       
        if (isMatch) {
            res.status(201).render('index');
            console.log("Congratulations passwords are matched")
        }
        else {
            res.send("invalid login Details");
        } 
        

    } catch (err) {
        res.status(400).send("invalid login details");
    }
})

Router.get('/register', (req, res) => {
    res.render('register');
})



Router.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {
            const registeration = new register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                gender: req.body.gender,
                password: password,
                confirmpassword: confirmpassword,
            })

            // Middleware code 
            // This code is available on conn.js
            // Generating tokens and it's code on conn.js
            console.log("The success part is" + registeration);
            const token = await registeration.generateAuthToken();
            console.log("The token part " + token)

            res.cookie('jwt',token, {
                expires: new Date(Date.now() + 30000),
                httpOnly:true,
            })

            const registerd = await registeration.save();
            res.render('index');
            console.log(registerd)

        } else { 
            res.send("password are not matching");
        }




    } catch (err) {
        res.status(400).send(err);
    }
})




module.exports = Router;