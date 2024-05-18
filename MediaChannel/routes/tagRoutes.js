// routes/tagRoutes.js

import express from 'express';
import { getAllTagsByElectionId, createTag, updateTag } from '../controllers/tagControllers.js';
import { verifyWithId,verify } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id',verify, getAllTagsByElectionId);   
router.post('/',verify, createTag);                  
router.put('/:id',verify, updateTag);                


export default router;