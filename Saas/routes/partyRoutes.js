// routes/tagRoutes.js

import express from 'express';
import { getParties,createParty,loadPartiesFromFile,updateParty } from '../controllers/partyControllers.js';
import { verifyWithId } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',verifyWithId, createParty);
router.get('/',verifyWithId, getParties);  
router.patch('/:id',verifyWithId, updateParty);
router.get('/load',loadPartiesFromFile);


export default router;


   

