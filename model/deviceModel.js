const sequelize = require("../config/database");
const Subject = require("./subjectModel");
const { Sequelize , DataTypes, Model } = require('sequelize');
const User = require("./userModel");
const Device = sequelize.define(
  "Device",
  {
    // Model attributes are defined here
    macAddress: {
      type: DataTypes.STRING,
    allowNull:false,
    unique:true,
      validate: {
        notEmpty: true,
        notNull: true,
      },
    },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: User, // 'M' would also work
          key: "id",
        },
        
      },
      location: {
        type: DataTypes.STRING,
        allowNull:false,
       defaultValue:"0,0"
        
      },
      route: {
        type: DataTypes.JSON,
       defaultValue:null
        
      },
    },
  
  {
    // Other model options go here
  }
);

// `sequelize.define` also returns the model
//   console.log(User === sequelize.models.User); // true

module.exports = Device;
