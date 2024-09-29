import React, { useState } from "react";
import SearchBar from "./SearchBar";
import ProfileInfo from "./ProfileInfo";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (setSearch) {
      onSearchNote(search);
    }
  };

  const onClearSearch = () => {
    setSearch("");
    handleClearSearch();
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="dark:bg-[#d3d8de] bg-[#17202a] flex item-center justify-between px-6 py-2 mx-2 drop-shadow-xl rounded-full">
      <h2
        className="text-xl font-medium text-[#d3d8de] dark:text-[#17202a] py-2 md:pl-8 cursor-pointer"
        onClick={handleReload}
      >
        Notes
      </h2>
      <SearchBar
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch} 
      />
      
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
