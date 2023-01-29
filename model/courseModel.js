const sequelize = require("../config/database");
const { Sequelize , DataTypes, Model } = require('sequelize');




const Course = sequelize.define('Course', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate:{
        notEmpty:true,
        notNull:true
      }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notEmpty:true,
          notNull:true
        }
      },
  
    duration:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
        notNull:true
      }
      
    },
    level:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isIn:{
                args: [['+2', 'bachelor','master']],
                msg:"role must be user or admin"
              } ,
         notEmpty:true,
         notNull:true
        }

        
      },
      type:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isIn:{
                args: [['yearly','semister']],
                msg:"role must be user or admin"
              } ,
         notEmpty:true,
         notNull:true
        }

        
      },
   
   
  }, {
    // Other model options go here
   
  });

 



  
    
     
      
  // `sequelize.define` also returns the model
//   console.log(User === sequelize.models.User); // true

module.exports=Course;