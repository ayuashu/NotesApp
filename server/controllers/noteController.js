const Note = require("../models/noteModel");

//Add note
exports.addNote = async (req, res) => {
  const { title, content, tags } = req.body;

  // Check for required fields
  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new note with the correct userId field
    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.user._id,
    });

    // Save the note to the database
    await newNote.save();
    res.status(201).json({ message: "Note added successfully", note: newNote }); // Optionally include the new note
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Edit note
exports.editNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    // Find the note with the given noteId and userId
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    // Update note fields
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error); // Log the full error for debugging
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

//Get All notes
exports.getAllNotes = async (req, res) => {
  const userId = req.user._id; // Extract the user ID from req.user

  try {
    // Use userId to find notes
    const notes = await Note.find({ userId }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving notes:", error); // Log the error
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

//Delete note
exports.deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ message: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Update IsPinned status
exports.updateIsPinned = async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({ message: "Note not found" });
    }
    note.isPinned = !note.isPinned;
    await note.save();
    if (note.isPinned) {
      return res.json({ message: "Note pinned successfully" });
    }
    return res.json({ message: "Note unpinned successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Search notes
exports.searchNotes = async (req, res) => {
  const { query } = req.query;
  const user = req.user;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const notes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    if (notes.length === 0) {
      return res.json({
        error: false,
        notes,
        message: "No Note Found",
      });
    }
    return res.json({
      error: false,
      notes,
      message: "Notes retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
