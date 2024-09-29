import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import EmptyCard from "../components/EmptyCard";
import NoDataTag from "../assets/images/Eyes.gif";
import AddNotesTag from "../assets/images/addNote.gif";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddNotes from "./AddNotes";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  //Edit note
  const handleEdit = (data) => {
    setIsModalOpen({ isShown: true, type: "edit", data: data });
  };

  //Close toast
  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  //Get user info
  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/user/get-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }

      const data = await response.json();

      if (data && data._id) {
        setUserInfo(data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Error fetching user info", error);
      }
    }
  };

  //Delete note
  const deleteNote = async (noteData) => {
    const token = localStorage.getItem("token");
    const noteId = noteData._id;
    try {
      const response = await fetch(
        "http://localhost:8000/note/delete-note/" + noteId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      const data = await response.json();
      if (data.message) {
        showToastMessage("Note Deleted Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  //Update isPinned
  const updateIsPinned = async (noteData) => {
    const token = localStorage.getItem("token");
    const noteId = noteData._id;
    try {
      const response = await fetch(
        "http://localhost:8000/note/update-is-pinned/" + noteId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPinned: !noteData.isPinned }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const data = await response.json();
      if (data.message) {
        showToastMessage(data.message);
        getAllNotes();
      }
    } catch (error) {
      console.error("Error updating note pin status", error);
    }
  };

  //Get all notes
  const getAllNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/note/get-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      if (data.notes) {
        setAllNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  //Search note
  const onSearchNote = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/note/search-notes?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.notes) {
          setIsSearch(true);
          showToastMessage(data.message, "success");
          setAllNotes(data.notes);
        }
      } else {
        throw new Error("Failed to search for notes");
      }
    } catch (error) {
      console.error("Error searching for notes", error);
    }
  };

  //Clear search
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <div className="bg-[#d3d8de] dark:bg-[#17202a] text-[#17202a] dark:text-[#d3d8de] min-h-screen">
      <div className="py-2"></div>
      <Navbar 
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 mx-10">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataTag : AddNotesTag}
            message={
              isSearch
                ? `Oops! No notes found.`
                : `Start creating your first note! Click the 'Add' button to add`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-3xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setIsModalOpen({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-white text-[32px]" />
      </button>

      <Modal
        isOpen={isModalOpen.isShown}
        onRequestClose={() =>
          setIsModalOpen({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
        contentLabel=""
        className="w-[50%] md:w-[30%] max-h-1/2 md:max-h-3/4 bg-[#ecf0f1] dark:bg-[#17202a] text-[#17202a] dark:text-[#ecf0f1]  rounded-xl mx-auto mt-28 p-5"
      >
        <AddNotes
          type={isModalOpen.type}
          noteData={isModalOpen.data}
          getAllNotes={getAllNotes}
          onClose={() =>
            setIsModalOpen({ isShown: false, type: "add", data: null })
          }
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
