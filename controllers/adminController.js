// controllers/adminController.js
const Work = require('../models/Work');
const User = require('../models/User');

exports.getPendingWorks = async (req, res) => {
  try {
    const works = await Work.find({ approvalStatus: 'Pending' }).populate('client_id', 'name email');
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }, 'name');
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.approveWork = async (req, res) => {
  try {
    const { workId } = req.body;

    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ error: 'Work not found' });

    work.approvalStatus = 'Approved';
    work.status = 'Approved'; // This shows up on client dashboard
    await work.save();

    res.json({ message: 'Work approved by admin', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.assignSupervisor = async (req, res) => {
  

  try {
    
    const { workId, supervisorId } = req.body;

    if (!workId || !supervisorId) {
      return res.status(400).json({ error: 'workId and supervisorId are required' });
    }

    const supervisor = await User.findOne({ _id: supervisorId, role: 'supervisor' });
    if (!supervisor) {
      return res.status(400).json({ error: 'Supervisor not found or invalid role' });
    }

    const work = await Work.findById(workId);
    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    if (work.approvalStatus !== 'Approved') {
      return res.status(400).json({ error: 'Work must be approved before assigning a supervisor' });
    }

    work.assigned_to = supervisorId;
    work.status = 'Assigned';

    await work.save();

    res.json({ message: 'Supervisor assigned successfully', work });
  } catch (err) {
    console.error('Assign supervisor error:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllWorks = async (req, res) => {
  try {
    const works = await Work.find().populate('client_id', 'name email').populate('assigned_to', 'name');
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.approveMaterialRequest = async (req, res) => {
  try {
    const { workId } = req.body;
    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ error: 'Work not found' });

    work.materialApproved = true; // ✅ This flag must exist
    await work.save();

    res.json({ message: 'Material request approved', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

