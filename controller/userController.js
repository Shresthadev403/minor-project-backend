
const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/userModel");

exports.getAllUsers = async (req, res, next) => {
 User.findAll().then(users=>{
    return res.status(200).json( {
        sucess:true,
        users:users
    })
 }).catch(err=>{
    console.log(err);
    next(new ErrorHandler(err));
 })
};

exports.createNewUser = (req, res, next) => {
  const { email, password ,name} = req.body;

  const user = User.build({ email: email, name:name, password: password });
  return user.save().then((user) => {
    console.log(user.toJSON());
    return res.status(200).json({
      sucess: true,
      message: "user created sucessfully",
    });
  }).catch(err=>{
    console.log(err);
    return next(new ErrorHandler(err));
  });
};

// exports.getMyProfile = (req, res, next) => {
//     const {token}=req.cookies;
//     const{ id,email}=req.user;
//     // console.log(token);
//     User.findByPk(id).then(user=>{
//         console.log(user);
//         return res.status(200).json({
//             sucess:true,
//             user:user
//         }
//         )
//     }).catch(err=>{
//         console.log(err);
//         next(new ErrorHandler(err));
//     })
  

//   };




