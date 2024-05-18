export const getElections = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const { id:mediaChannel  } = req.body;
      const elections = await Election.find({ mediaChannel })
        .skip(skip)
        .limit(limit);
      const total = await Election.countDocuments({ mediaChannel });
  
      res.status(200).json({
        success: true,
        data: elections,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message});
    }
  };