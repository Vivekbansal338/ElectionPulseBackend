// controllers/TagController.js

import Tag from '../../models/tagModel.js';

export const getAllTagsByElectionId = async (req, res) => {
  try {
    const tags = await Tag.find({ Election: req.params.id});
    res.status(200).json({
        success: true,
        data: tags
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createTag = async (req, res) => {
  const tag = new Tag({
    Election: req.body.Election,
    name: req.body.name,
  });

  try {
    const newTag = await tag.save();
    res.status(201).json({
        success: true,
        data: newTag
        
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message});
  }
};

export const updateTag = async (req, res) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
        success: true,
        data: updatedTag
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message});
  }
};

