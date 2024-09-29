const express = require('express');
const auth = require('../middleware/authMiddleware');
const { addNote, editNote, getAllNotes, deleteNote, updateIsPinned, searchNotes } = require('../controllers/noteController');

const router = express.Router();
router.post('/add-note', auth, addNote);
router.put('/edit-note/:noteId', auth, editNote);
router.get('/get-notes', auth, getAllNotes);
router.delete('/delete-note/:noteId', auth, deleteNote);
router.put('/update-is-pinned/:noteId', auth, updateIsPinned);
router.get('/search-notes', auth, searchNotes);



module.exports = router;