import { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

import SignInOAuthButtons from "./SignInOAuthButtons";
import { Button } from "./ui/button";
import { useBookStore } from "@/stores/useBookStore";
import { useCartStore } from "@/stores/useCartStore";
import { formatNumber } from "@/middlewares/dataFormatter";
import { useUserStore } from "@/stores/useUserStore";

export default function Topbar() {
  const { isAdmin } = useUserStore();
  const { setSearchTerm, getSearchedBooks } = useBookStore();
  const { getCartItemCount } = useCartStore();

  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
    }
  }, [searchInput]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full mx-auto flex items-center gap-6 p-4 sticky top-0 bg-white z-10">
      {/* Logo */}
      <Link to="/" onClick={() => setSearchTerm("")}>
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="/img/BookStore_Icon.png"
            alt="MyBookStore Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-[#3333CC]">MyBookStore</h1>
        </div>
      </Link>

      {/* Search bar */}
      <div className="relative flex-1" ref={dropdownRef}>
        <div className="flex items-center h-11 bg-white shadow-sm border border-gray-300 rounded-md px-4">
          <input
            type="text"
            value={searchInput}
            placeholder="Nhập từ khóa bạn muốn tìm kiếm: Tên sách, tên tác giả, thể loại sách, ..."
            className="flex-1 bg-transparent text-sm placeholder-gray-500 outline-none"
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchTerm(e.target.value);
            }}
          />
          <Search className="w-5 h-5 text-gray-600 ml-2" />
        </div>

        {/* Search results dropdown */}
        {showDropdown && (
          <div className="absolute w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-65 overflow-y-auto animate-fadeIn transition-all duration-200">
            {getSearchedBooks().length > 0 ? (
              getSearchedBooks().map((result) => (
                <Link
                  to={`/book-detail/${result._id}`}
                  key={result._id}
                  onClick={() => setSearchInput("")}
                >
                  <div className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm">
                    {/* Left: Image + Title + Author */}
                    <div className="flex items-center gap-3">
                      <img
                        src={result.coverImageUrl}
                        alt={result.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="text-md font-medium text-gray-800">
                          {result.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          Tác giả: {result.author}
                        </span>
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right text-sm text-[#3333CC] font-semibold whitespace-nowrap">
                      {formatNumber(String(result.price))}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-md text-center">
                Không có kết quả
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart */}
      <Link to="/cart" className="flex items-center">
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            {getCartItemCount()}
          </span>
        </div>
      </Link>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {isAdmin && (
          <Button className="text-white h-11 bg-[#3333CC] hover:bg-blue-900 transition-colors">
            <Link to="/admin" target="_blank" rel="noopener noreferrer">
              Admin Dashboard
            </Link>
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
