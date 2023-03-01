const sequelize = require("../config/database");
const UserTravel = require("../model/userTravelModel");
const { filter } = require("../utils/auth");
const ErrorHandler = require("../utils/errorHandler");
const { calculateBusFareRatePerMeter } = require("../utils/gpsUtils");
const sendMail =require('../utils/sendMail')

exports.getAllUserTravel = async (req, res, next) => {
  const filterParams = await filter(req.query);

  UserTravel.findAll(filterParams)
    .then((userTravel) => {
      return res.status(200).json({
        sucess: true,
        userTravel: userTravel,
      });
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(err));
    });
};

exports.createNewUserTravel =async (req, res, next) => {
  const { macAddress,tagId } = req.body;
  const date = new Date();

  const userResult=await sequelize.query(`select id as userId from users where tagId="${tagId}";`,{
    type: sequelize.QueryTypes.SELECT 
  });

  const {userId}=userResult[0];
  console.log((userId));

  const busTravelResult=await sequelize.query(`select bustravels.id as busTravelId from devices inner join bustravels on devices.id=bustravels.deviceId where devices.macAddress="${macAddress}" and bustravels.stoplocation is null;`,{
    type: sequelize.QueryTypes.SELECT 
  });

  const{busTravelId}=busTravelResult[0];




//   const recentNodes = {
//     locationsWithTimeStamp: [startLocation, date],
//   };

  // const locations=[[location]]
  const result=await sequelize.query(`select recentNodes from busTravels where id=${busTravelId};`,{
    type: sequelize.QueryTypes.SELECT 
  });
  const latestNode=result[0].recentNodes.locationsWithTimeStamp;
  // console.log(latestNode[latestNode.length-1][0]);
  const startLocation=latestNode[latestNode.length-1][0];
  // const startLocation=locationsWithTimeStamp[locationsWithTimeStamp.length-1][0];
  // console.log(startLocation);
  // console.log(nodesOfBusTravel);
  const userTravel = UserTravel.build({
    busTravelId: busTravelId,
    startLocation: startLocation,
    userId: userId,
  });
  return userTravel
    .save()
    .then((userTravel) => {
      console.log(userTravel.toJSON());
      return res.status(200).json({
        sucess: true,
        message: "course userTravel created sucessfully",
      });
    })
    .catch((err) => {
      console.log(err);
      return next(new ErrorHandler(err));
    });
};

exports.getUserTravelDetails = (req, res, next) => {
  const { userTravelId } = req.params;
  console.log(userTravelId);
  UserTravel.findByPk(userTravelId)
    .then((userTravel) => {
      if (!userTravel) {
        next(new ErrorHandler(" userTravel doesnot exist", 404));
      }
      console.log(userTravel.toJSON());
      return res.status(200).json({
        sucess: true,
        userTravel: userTravel,
      });
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(err));
    });
};

exports.deleteUserTravel = (req, res, next) => {
  const { userTravelId } = req.params;
  // console.log(token);
  UserTravel.findByPk(userTravelId)
    .then((userTravel) => {
      if (!userTravel) {
        next(new ErrorHandler(" userTravel doesnot exist", 404));
      }
      // console.log(subject.toJSON());
      userTravel.destroy().then(() => {
        return res.status(200).json({
          sucess: true,
          message: `course userTravel deleted sucessfully`,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(err));
    });
};

exports.updateUserTravel = async (req, res, next) => {
  //  console.log("cuns");
  const filterParams = await filter(req.query);
  const { userTravelId } = req.params;
  const { locations } = req.body;
  console.log(userTravelId, "ddddddddddddddddddddddddddddddddddddddd");
  //   console.log(macAddress);
  // console.log(userTravelId);

  UserTravel.findByPk(userTravelId)
    .then((userTravel) => {
      console.log(userTravel);
      if (!userTravel) {
        console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
        return next(new ErrorHandler("userTravel doesnot exist",404));
      }
      // userTravel.nodes={locations:locations};
      return userTravel.save().then(() => {
        // console.log(status);
        return res.status(200).json({
          sucess: true,
          message: `UserTravel  updated sucessfully`,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(err));
    });
};

exports.userTravelCheckOut = async (req, res, next) => {
  //  console.log("cuns");
  // const filterParams = await filter(req.query);

  const { macAddress,tagId } = req.body;
  const userTravelResult=await sequelize.query(`select usertravels.id as userTravelId from usertravels inner join users on usertravels.userId=users.id inner join devices where devices.macAddress="${macAddress}" and users.tagId="${tagId}" and usertravels.destinationLocation is null;`,{
    type: sequelize.QueryTypes.SELECT 
  });

  console.log(userTravelResult);
  if(userTravelResult.length==0){
    return next(new ErrorHandler("please check in bus firsst",400))
  }
  const{ userTravelId}=userTravelResult[0];
  

  UserTravel.findByPk(userTravelId)
    .then(async(userTravel) => {
      console.log(userTravel);
      if (!userTravel) {
        // console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
        return next(new ErrorHandler("userTravel doesnot exist",404));
      }
      const result=await sequelize.query(`select recentNodes from busTravels where id=${userTravel.busTravelId};`,{
        type: sequelize.QueryTypes.SELECT 
      });
  const latestNode=result[0].recentNodes.locationsWithTimeStamp;
  const latestDestinationLocation=latestNode[latestNode.length-1][0];
      // console.log(latestNode);
      // console.log(latestDestinationLocation);
      const busPriceRate=calculateBusFareRatePerMeter(userTravel.distanceTravelled);
      console.log(busPriceRate);
      userTravel.destinationLocation=latestDestinationLocation;
      userTravel.priceRate=busPriceRate;
      const totalPrice=userTravel.distanceTravelled*busPriceRate;
      console.log(totalPrice);
      console.log(userTravel.userId);

  const result1=await sequelize.query(`update Users set balance=balance-${totalPrice} where id=${userTravel.userId};`,{
    type: sequelize.QueryTypes.UPDATE
  });

  console.log(userTravel);
     
      sendMail("mygaming.sta@gmail.com",userTravel);

      // userTravel.nodes={locations:locations};
      return userTravel.save().then(() => {
        // console.log(status);
        return res.status(200).json({
          sucess: true,
          message: `UserTravel  check out sucessfully`,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      next(new ErrorHandler(err));
    });
};
