import LocalResource from "../models/LocalResource.js";

// @desc    Get all verified local resources
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { verified: true };
    
    if (type && type !== 'all') {
      query.type = type;
    }

    const resources = await LocalResource.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single resource by ID
// @route   GET /api/resources/:id
// @access  Private
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await LocalResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};
