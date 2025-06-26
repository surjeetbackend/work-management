// routes/supervisorRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  
  getApprovedWorks,
  startWork,
  completeWork,
  requestMaterial
} = require('../controllers/supervisorController');

router.get('/approved-works', verifyToken, authorizeRoles('supervisor'), getApprovedWorks);
router.post('/start-work', verifyToken, authorizeRoles('supervisor'), startWork);
router.post('/complete-work', verifyToken, authorizeRoles('supervisor'), completeWork);
router.post('/material-request', verifyToken, authorizeRoles('supervisor'), requestMaterial);
const upload = require('../middleware/upload');


router.post('/start-work', upload.single('startPhoto'), startWork);
router.post('/complete-work', upload.single('completionPhoto'), completeWork);



module.exports = router;
