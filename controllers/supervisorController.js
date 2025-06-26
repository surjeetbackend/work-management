const Work = require('../models/Work');

// ✅ 1. Get assigned/In Progress works
exports.getApprovedWorks = async (req, res) => {
  try {
    const works = await Work.find({
      assigned_to: req.user._id,
      status: { $in: ['Assigned', 'In Progress'] }
    })
      .populate('client_id', 'name email')
      .populate('assigned_to', 'name');

    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 2. Start work with estimatedTime, laborRequired, startPhoto
exports.startWork = async (req, res) => {
  try {
    const startPhotoUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';
    const { workId, estimatedTime, laborRequired, startPhoto } = req.body;
    const work = await Work.findById(workId);

    if (!work) return res.status(404).json({ error: 'Work not found' });
    if (String(work.assigned_to) !== String(req.user._id)) return res.status(403).json({ error: 'Not authorized' });
    if (work.status !== 'Assigned') return res.status(400).json({ error: 'Work is not in an assignable state' });

    work.status = 'In Progress';
    work.estimatedTime = estimatedTime;
    work.laborRequired = laborRequired;
    work.startPhoto = startPhoto;

    await work.save();
    res.json({ message: 'Work started successfully', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 3. Complete work with photo
exports.completeWork = async (req, res) => {
  try {
    const completionPhotoUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

    const { workId, completionPhoto } = req.body;
    const work = await Work.findById(workId);

    if (!work) return res.status(404).json({ error: 'Work not found' });
    if (String(work.assigned_to) !== String(req.user._id)) return res.status(403).json({ error: 'Not authorized' });
    if (work.status !== 'In Progress') return res.status(400).json({ error: 'Work must be In Progress to complete' });

    work.status = 'Completed';
    work.completionPhoto = completionPhoto;

    await work.save();
    res.json({ message: 'Work marked as completed', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 4. Material request
exports.requestMaterial = async (req, res) => {
  try {
    const { workId, materialRequest } = req.body;
    const work = await Work.findById(workId);

    if (!work) return res.status(404).json({ error: 'Work not found' });
    if (String(work.assigned_to) !== String(req.user._id)) return res.status(403).json({ error: 'Not authorized' });

    work.materialRequest = materialRequest;
    await work.save();

    res.json({ message: 'Material request submitted', work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
