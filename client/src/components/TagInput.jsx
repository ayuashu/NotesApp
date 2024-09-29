import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({tags, setTags}) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);  
    }

    const addNewTag = () => {
        if(inputValue.trim !== ""){
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    }

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            addNewTag();
        }
    }

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2 rounded-lg">
        {tags.map((tag,index) => (
            <span key={index} className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-900 bg-slate-900 dark:bg-slate-200 px-3  py-1 rounded-3xl">
                # {tag}
                <button onClick={() => {removeTag(tag)}}>
                    <MdClose />
                </button>
            </span>
        ))}
    </div>
    )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded-lg outline-none bg-[#17202a] dark:bg-[#dadade] text-[#b3b5b5] dark:text-[#17202a]"
          placeholder="Add tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-blue-700 hover:bg-blue-700"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  )
}

export default TagInput;
