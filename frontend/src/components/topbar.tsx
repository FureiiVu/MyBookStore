import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

import SignInOAuthButtons from "./SignInOAuthButtons";
import { Button } from "./ui/button";

export default function Topbar() {
  const isAdmin = false;

  return (
    <div className="w-full max-w-[1400px] mx-auto flex items-center gap-6 p-4 sticky top-0 bg-white z-10">
      {/* Logo and Store Name */}
      <Link to="/">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/img/BookStore_Icon.png"
            alt="MyBookStore Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-[#3333CC]">MyBookStore</h1>
        </div>
      </Link>

      {/* Search bar (takes full available space) */}
      <div className="flex-1">
        <div className="flex items-center h-11 bg-white shadow-sm border border-gray-300 rounded-md px-4">
          <input
            type="text"
            placeholder="Nhập từ khóa bạn muốn tìm kiếm: Tên sách, tên tác giả, thể loại sách, ..."
            className="flex-1 bg-transparent text-sm placeholder-gray-500 outline-none"
          />
          <Search className="w-5 h-5 text-gray-600 ml-2" />
        </div>
      </div>

      {/* Cart icon */}
      <div className="flex-shrink-0">
        <ShoppingCart className="w-6 h-6 text-gray-600" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {isAdmin && (
          <Button className="text-white h-11 bg-[#3333CC] hover:bg-blue-900 transition-colors">
            <Link to={"/admin"}>Admin Dashboard</Link>
          </Button>
        )}
        <SignedIn>
          <SignOutButton>
            <Button className="text-white h-11 bg-[#3333CC] hover:bg-blue-900 transition-colors">
              Đăng xuất
            </Button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>
      </div>
    </div>
  );
}
