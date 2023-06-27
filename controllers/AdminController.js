const registertbl = require('../models/registertbl')

const blogtbl = require('../models/blogtbl')

const fs = require('fs')

const login = (req, res) => {
    if (res.locals.users) {
        return res.redirect('/dashboard')
    }
    return res.render('login');
}

const register = (req, res) => {
    return res.render('register')
}

const dashboard = (req, res) => {
    return res.render('dashboard')
}

const registerData = async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body
        if (password == cpassword) {
            let userdata = await registertbl.create({
                name: name,
                email: email,
                password: password
            })
            if (userdata) {
                console.log("Used data Add successful");
                return res.redirect('/')
            }
            else {
                console.log("data not add");
                return res.redirect('back')
            }
        }
        else {
            console.log("password and confirm password in not match");
            return false
        }
    }
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

const loginData = (req, res) => {
    return res.redirect('/dashboard')
}

const logout = (req, res) => {
    req.logout((err) => {
        console.log(err);
        return false
    })
    return res.redirect('/');
}

const addblog = (req, res) => {
    return res.render('addblog', {
        single: ""
    })
}

const insertdata = async (req, res) => {
    try {
        const { editid, name, discription } = req.body
        if (editid) {
            if (req.file) {
                if (!name || !discription) {
                    console.log("Enter All Data");
                    return res.redirect('/')
                }
                let dltimg = await blogtbl.findById(editid)
                if (dltimg) {
                    fs.unlinkSync(dltimg.image)
                }
                else {
                    console.log("image not delete");
                    return false
                }
                let image = "";
                if(req.file){
                    image = req.file.path
                }
                let updatedata = await blogtbl.findByIdAndUpdate(editid,{
                    name : name,
                    discription : discription,
                    image : image
                })
                if(updatedata){
                    console.log("Edit Done");
                    return res.redirect('/viewblog')
                }
                else {
                    console.log("Not Edited");
                    return false
                }
            }
            else {
                image = "";
                let singledata = await blogtbl.findById(editid);
                if (!name || !discription || !image) {
                    console.log("Enter All Data");
                    return res.redirect('/')
                }
                if(singledata){
                    image = singledata.image;
                    let updatedata = await blogtbl.findByIdAndUpdate(editid,{
                        name : name,
                        discription : discription,
                        image : image
                    })
                    if(updatedata){
                        console.log("Edit Done");
                        return res.redirect('/viewblog')
                    }
                    else {
                        console.log("Not Edited");
                        return false
                    }
                }
            }
        }
        else {
            let image = "";
            if (req.file) {
                image = req.file.path
            }
            if (!name || !discription || !image) {
                console.log("Enter All data");
                return res.redirect('/addblog')
            }
            let data = await blogtbl.create({
                name: name,
                discription: discription,
                image: image
            })
            if (data) {
                console.log("Data Successfully Add");
                return res.redirect('/viewblog');
            }
            else {
                console.log(err);
                return res.redirect('back');
            }
        }
    }
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

const viewblog = async (req, res) => {
    try {
        let blogdata = await blogtbl.find({});
        if (blogdata) {
            return res.render('viewblog', {
                blogdata
            })
        }
        else {
            console.log("record not found");
            return false
        }
    }
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

const deletedata = async (req, res) => {
    try {
        let id = req.query.id
        let dltimg = await blogtbl.findById(id)
        if (dltimg) {
            fs.unlinkSync(dltimg.image)
        }
        else {
            console.log("image not delete");
            return false
        }
        let dltdata = await blogtbl.findByIdAndDelete(id)
        if (dltdata) {
            console.log("data deleted");
            return res.redirect('back');
        }
        else {
            console.log("data not delete");
            return res.redirect('back');
        }
    }
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

const editdata = async (req, res) => {
    try {
        let id = req.query.id;
        let single = await blogtbl.findById(id)
        if (single) {
            return res.render('addblog', {
                single
            })
        }
        else {
            console.log("record not found");
            return false
        }
    }
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

const newpassword = (req,res) =>{
    return res.render('newpassword')
}

const Setnewpassword = async(req,res)=>{
    try {
        const {editid,npassword,cpassword} = req.body;
        if(!npassword || !cpassword){
            console.log("Remains Some Password");
            return res.redirect('/newpassword')
        }
        if(npassword != cpassword){
            console.log("new password And Confirm Password are not match");
            return res.redirect('/newpassword')
        }
        let changepassword = await registertbl.findByIdAndUpdate(editid,{
            password : npassword
        })
        if(changepassword){
            console.log("Password successfully change");
            return res.redirect('/newpassword')
        }
    } 
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

const profile = (req,res)=>{
    return res.render('profile')
}

const changeprofile = async(req,res)=>{
    try {
        const {editid,name,password,cpassword} = req.body
        if(!name || !password || !cpassword){
            console.log("Enter All the Field");
            return res.redirect('back')
        }
        if(password != cpassword){
            console.log("Both Password are not match");
            return res.redirect('back')
        }
        let changeprofile = await registertbl.findByIdAndUpdate(editid,{
            name : name,
            password : password
        })
        if(changeprofile){
            console.log("Profile is change");
            return res.redirect('back')
        }
    } 
    catch (err) {
        if (err) {
            console.log(err);
            return false
        }
    }
}

module.exports = {
    login,
    register,
    dashboard,
    registerData,
    loginData,
    logout,
    addblog,
    insertdata,
    viewblog,
    deletedata,
    editdata,
    newpassword,
    Setnewpassword,
    profile,
    changeprofile
}