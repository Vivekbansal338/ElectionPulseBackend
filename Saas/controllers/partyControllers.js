// partyController.js
import Party from '../../models/partyModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';



export const getParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json({
      success: true,
      data: parties,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createParty = async (req, res) => {
  const party = req.body;
  const newParty = new Party(party);
  try {
    await newParty.save();
    res.status(201).json({
      success: true,
      data: parties,
    });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message});
  }
};

export const updateParty = async (req, res) => {
  try{
  const { id } = req.params;
    const party = req.body;
  const updatedParty = await Party.findByIdAndUpdate(id, party, { new: true });
  res.status(200).json({ success: true, data: updatedParty });
  }
  catch(error){
    res.status(404).json({ success: false, message: error.message });
  }
}

export const loadPartiesFromFile = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = join(__dirname, '../../Utils/nationalpartie.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const parties = JSON.parse(data);
    for (let party of parties) {
      const newParty = new Party(party);
      await newParty.save();
    }
    res.status(201).json({
      success: true,
      data: parties,
    });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message});
  }
};