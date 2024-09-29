import React from "react";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const getInitials = (name) => {
    if (!name) return "";
  
    const words = name.split(" ");
    let initials = "";
  
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i][0];
    }
    return initials.toUpperCase();
  };

  return (
    <div className="flex item-center gap-3 pr-3md:pr-8 ">
      
      <div className="w-12 h-12 flex items-center justify-center font-semibold rounded-full bg-[#d3d8de] dark:bg-[#17202a] text-[#17202a] dark:text-[#d3d8de]">
        {getInitials(userInfo?.username)}
      </div>
      <div className="flex flex-col items-center justify-center dark:text-[#17202a] text-[#d3d8de] ">
        <p className="text-xs font-extrabold">{(userInfo?.username)}</p>
        <button className="text-xs text-slate-400 dark:text-slate-900 underline font-semibold" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="w-8"></div>
    </div>
  );
};

export default ProfileInfo;
