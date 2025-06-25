// controllers/supervisorController.js
const Work = require('../models/Work');

exports.getApprovedWorks = async (req, res) => {
  try {
    const works = await Work.find({ assigned_to: req.user._id, status: { $in: ['Approved', 'In Progress'] } })
      .populate('client_id', 'name email');
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startWork = async (req, res) => {
  try {
    const { workId } = req.body;
    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ error: 'Work not found' });

    if (String(work.assigned_to) !== String(req.user._id))
      return res.status(403).json({ error: 'Not authorized' });

    work.status = 'In Progress';
    await work.save();
    res.json({ message: 'Work started', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeWork = async (req, res) => {
  try {
    const { workId } = req.body;
    const work = await Work.findById(workId);
    if (!work) return res.status(404).json({ error: 'Work not found' });

    if (String(work.assigned_to) !== String(req.user._id))
      return res.status(403).json({ error: 'Not authorized' });

    work.status = 'Completed';
    await work.save();
    res.json({ message: 'Work completed', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};