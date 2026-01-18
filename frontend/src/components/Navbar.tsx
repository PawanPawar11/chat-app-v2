import { Zap } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            chat-app-v2
          </h1>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
