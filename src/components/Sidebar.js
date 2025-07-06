import React from "react";

const Sidebar = ({ history }) => {
  return (
    <div className="w-[20%] bg-[linear-gradient(263deg,#FFC2FF_-8.97%,#FFA4D6_43.93%,#FF8AA6_96.83%)] text-white p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-4">Search History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index} className="py-2 px-2 hover:bg-white hover:text-black rounded cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
