import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 border border-red-400">

        <div className="flex justify-between">

          {/* 메뉴 */}
          <div>
            <div>메뉴1</div>
            <div>메뉴2</div>
          </div>

          {/* 메뉴2 */}
          <div>sign</div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
