const sequelize = require("../config/database");
const ErrorHandler = require("../utils/errorHandler");

exports.getBusTravelInfoByDeviceId = async (req, res, next) => {
  const { deviceId } = req.params;

  try {
    const result = await sequelize.query(
      `select Device.id as deviceId,macAddress,Device.routeId as routeId,ownerId,Route.nodes as routeNodes,BusTravel.id as bustravelId,velocity,BusTravel.startLocation as busTravelStartLocation,BusTravel.stopLocation as busTravelStopLocation,BusTravel.recentNodes as busTravelRecentNodes from Device inner join Route  on Device.routeId=Route.id inner join BusTravel on BusTravel.deviceId=Device.id where BusTravel.stopLocation is null and Device.id=${deviceId};`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      sucess: true,
      busInfo: result,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorHandler(err));
  }
};


exports.getAllTravellingBusDevicesInfo = async (req, res, next) => {

  try {
    const result = await sequelize.query(
      `select Device.id as deviceId,macAddress,Device.routeId as routeId,ownerId,Route.nodes as routeNodes,BusTravel.id as bustravelId,velocity,BusTravel.startLocation as busTravelStartLocation,BusTravel.stopLocation as busTravelStopLocation,BusTravel.recentNodes as busTravelRecentNodes from Device inner join Route  on Device.routeId=Route.id inner join BusTravel on BusTravel.deviceId=Device.id where BusTravel.stopLocation is null;`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      sucess: true,
      busInfo: result,
    });
  } catch (err) {
    console.log(err);
    next(new ErrorHandler(err));
  }
};
