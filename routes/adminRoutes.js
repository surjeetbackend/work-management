const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
// In Mongo shell or Mongoose
const mongoose = require('mongoose');
const User = require('../models/User'); 



const {

     approveWork,
  getPendingWorks,
  assignSupervisor,
 approveMaterialRequest,
  getSupervisors,
  getAllWorks 

} = require('../controllers/adminController');

router.get('/supervisors', verifyToken, authorizeRoles('admin'), getSupervisors);
router.get('/pending-works', verifyToken, authorizeRoles('admin'), getPendingWorks);
router.post('/approve-work', verifyToken, authorizeRoles('admin'), approveWork);
router.post('/assign-supervisor', verifyToken, authorizeRoles('admin'), assignSupervisor);
router.post('/approve-material', verifyToken, approveMaterialRequest);
router.get('/all-works', verifyToken, authorizeRoles('admin'), getAllWorks);



module.exports = router;
