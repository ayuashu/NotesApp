import React from "react";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border-2 border-[#17202a] dark:border-[#ecf0f1] p-4 bg-[#ecf0f1] dark:bg-[#17202a] text-[#17202a] dark:text-[#ecf0f1] hover:shadow-lg hover:shadow-[#1b1b1c] dark:hover:shadow-[#dadade] transition-all ease-in-out rounded-3xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl">{title}</div>
          <span className="text-xs font-medium text-[#17202a] dark:text-[#d1d5de]">{date?.slice(0,10)}</span>
        </div>
        <MdOutlinePushPin
          onClick={onPinNote}
          className={`icon-btn ${isPinned ? "text-primary" : "text-gray-500 dark:text-slate-300"}`}
        />       
      </div>

      <p className='text-xs text-slate-600 dark:text-stone-400 mt-2'>{content?.slice(0,60)}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500 font-semibold'>{tags}</div>

        <div className='flex items-center gap-2 '>
            <MdCreate 
                className='icon-btn text-gray-500 dark:text-slate-300 hover:text-green-600'
                onClick={onEdit}
            />
            <MdDelete 
                className='icon-btn text-gray-500 dark:text-slate-300 hover:text-red-600'
                onClick={onDelete}
            />   
        </div>
        </div>
    </div>
  );
};

export default NoteCard;
