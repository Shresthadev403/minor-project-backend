const { NotBeforeError } = require('jsonwebtoken');
const Device = require('../model/deviceModel');
const Course = require('../model/courseModel');
const Note = require('../model/noteModel');
const Subject = require('../model/subjectModel');
const User=require('../model/userModel');
const CourseSyllabus=require('../model/courseSyllabusModel');


exports.updateAllModelSchema=async(req,res,next)=>{
  await  User.sync({force:true});
  await Device.sync({force:true});
  // await Subject.sync({force:true});
  // await Book.sync({force:true});
  // await Note.sync({force:true});
  // await CourseSyllabus.sync({force:true});
  

  return res.status(200).json({
    sucess:true,
    message:"all models updated sucessfully"
  });
}