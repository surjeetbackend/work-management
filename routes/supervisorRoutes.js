// routes/supervisorRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
    
  getApprovedWorks,
  startWork,
  completeWork
} = require('../controllers/supervisorController');

router.get('/approved-works', verifyToken, authorizeRoles('supervisor'), getApprovedWorks);
router.post('/start-work', verifyToken, authorizeRoles('supervisor'), startWork);
router.post('/complete-work', verifyToken, authorizeRoles('supervisor'), completeWork);

module.exports = router;
