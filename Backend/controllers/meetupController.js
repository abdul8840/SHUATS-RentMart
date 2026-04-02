import MeetupLocation from '../models/MeetupLocation.js';

// Get all meetup locations
export const getMeetupLocations = async (req, res) => {
  try {
    const locations = await MeetupLocation.find({ isActive: true })
      .sort({ usageCount: -1 });

    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get suggested meetup locations
export const getSuggestedLocations = async (req, res) => {
  try {
    const { department } = req.query;

    let locations = await MeetupLocation.find({ isActive: true, isSafe: true })
      .sort({ usageCount: -1 })
      .limit(5);

    // If department is provided, try to suggest department building first
    if (department) {
      const deptLocation = await MeetupLocation.findOne({
        isActive: true,
        type: 'Department',
        name: { $regex: department, $options: 'i' }
      });

      if (deptLocation) {
        locations = [deptLocation, ...locations.filter(l => l._id.toString() !== deptLocation._id.toString())].slice(0, 5);
      }
    }

    res.json({ success: true, locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increment usage count
export const useLocation = async (req, res) => {
  try {
    await MeetupLocation.findByIdAndUpdate(req.params.id, {
      $inc: { usageCount: 1 }
    });

    res.json({ success: true, message: 'Location usage recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};