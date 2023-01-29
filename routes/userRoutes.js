const express=require('express');
const { login, logOut } = require('../controller/authController');
const { getAllUsers, createNewUser, getMyProfile } = require('../controller/userController');
const { authenticateUser, requiredToken } = require('../middlewares/authMiddleWare');

const router=express.Router();

router.get('/users',requiredToken,getAllUsers);

router.post('/create/user',createNewUser);
// router.get('/myprofile',authenticateUser,getMyProfile);






module.exports=router;