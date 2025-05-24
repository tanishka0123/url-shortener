import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/Context";
import useFetch from "@/hooks/UseFetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

function Header() {
  const nav = useNavigate();
  const { user, fetchUser } = UrlState();
  const { loading, fn } = useFetch(logout);

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" alt="logo" className="h-26" />
        </Link>
        <div>
          {!user ? (
            <Button onClick={() => nav("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.profile}
                    className="object-contain"
                  />
                  <AvatarFallback>TG</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fn().then(() => {
                      fetchUser();
                      nav("/");
                    });
                  }}
                  className="text-red-400"
                >
                  <LogOut className="text-red-400 mr-1 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#3585f5" />}
    </>
  );
}

export default Header;
