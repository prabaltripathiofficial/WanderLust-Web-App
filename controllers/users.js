const User =require("../models/user.js");


module.exports.signUpRoute = function(req, res){
    res.render('users/signup.ejs');
    };


    module.exports.signUpPostRoute = async function(req, res){
        try {
        let {username, email, password}= req.body;
        const newUser= new User({
            username,
            email,
            password
        });
          const registeredUser = await User.register(newUser, password);
           req.login(registeredUser, (err)=>{
            if (err) {
                return next(err);
            }
            req.flash('success',"Welcome to WanderLust");
            res.redirect("/listings");
           });
        }
        catch (err) {
          req.flash('error', err.message);
          res.redirect('/signup');
        }
    };

    module.exports.logInRoute = (req, res)=>{
        res.render('users/login.ejs');    
        };



        module.exports.logOutRoute = (req, res)=>{
            req.logout((err)=>{
                if(err)
                {
                    return next(err);
                }
                else{
                    req.flash('success', "You have been successfully logged out!!");
                    res.redirect('/listings');
                }
            })
        };

        module.exports.logInPostRoute = async(req, res)=>{
         req.flash('success',"Welcome back to WanderLust!!");
         let redirectUrl =res.locals.redirectUrl || '/listings';
         res.redirect(redirectUrl);
        };