const express=require('express');
const { getAllBusTravel, createNewBusTravel, getBusTravelDetails, updateBusTravel, endBusTravel, deleteBusTravel }=require('../controller/busTravelController');

const router=express.Router();

router.get('/bustravels',getAllBusTravel);
router.post('/create/bustravel',createNewBusTravel);
router.get('/bustravel/:busTravelId',getBusTravelDetails);
router.put('/update/bustravel',updateBusTravel);
router.put('/end/bustravel/:busTravelId',endBusTravel);
router.delete('/delete/bustravel/:busTravelId',deleteBusTravel);

module.exports=router;