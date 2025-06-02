import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

import SignInOAuthButtons from "./SignInOAuthButtons";
import { Button } from "./ui/button";

export default function Topbar() {
  const isAdmin = false;

  return (
    <div className="flex justify-between items-center p-4 sticky top-0 bg-white z-10">
      {/* Logo and Store Name */}
      <div className="flex gap-2 items-center">
        <img
          src="/img/BookStore_Icon.png"
          alt="MyBookStore Logo"
          className="w-10 h-10"
        />
        <h1 className="text-3xl font-bold" style={{ color: "#3333CC" }}>
          MyBookStore
        </h1>
      </div>

      <div className="text-black hover:text-blue-400">
        {isAdmin && <Link to={"/admin"}>Admin Dashboard</Link>}

        <SignedIn>
          <SignOutButton>
            <Button
              className="w-full text-white h-11"
              style={{
                backgroundColor: "#3333CC",
              }}
            >
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
