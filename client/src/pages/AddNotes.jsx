import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../components/TagInput";

const AddNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  //Add note
  const addNewNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/note/add-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      });

      const data = await response.json();
      if (data?.note) {
        showToastMessage("Note Added Successfully");
        await getAllNotes();
        onClose();
      } else {
        throw new Error(data?.message || "Failed to add the note.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while adding the note.");
    }
  };

  //Edit note
  const editNote = async () => {
    const token = localStorage.getItem("token");
    const noteId = noteData._id; 

    try {
      const response = await fetch("http://localhost:8000/note/edit-note/" + noteId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      });

      const data = await response.json();
      console.log("Edit Note Response:", data);
      if (data?.note) {
        showToastMessage("Note Updated Successfully");
        await getAllNotes();
        onClose();
      } else {
        throw new Error(data?.message || "Failed to update the note.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while updating the note.");
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative ">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 "
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          placeholder="Go to Gym at 5"
          className="text-lg bg-[#17202a] dark:bg-[#dadade] text-[#b3b5b5] dark:text-[#17202a] rounded-lg pl-2 outline-none h-9"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <label className="input-label">Content</label>
        <textarea
          placeholder="Content"
          className="text-sm bg-[#17202a] dark:bg-[#dadade] text-[#b3b5b5] dark:text-[#17202a] outline-none p-2 rounded-lg"
          rows={7}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mt-2">
        <label className="input-label mt-2">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3 rounded-lg"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddNotes;
