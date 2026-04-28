"use client";

import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { Moon, Sun, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const nickname = session?.user?.nickname ?? "";
  const email = session?.user?.email ?? "";
  const initials = nickname.slice(0, 2).toUpperCase();
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/u/${nickname}`;

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-60 h-screen sticky top-0 flex flex-col border-r bg-card px-4 py-6 shrink-0">
      {/* Logo */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">✨ Wishlist</h1>
      </div>

      <Separator />

      {/* User info */}
      <div className="flex items-center gap-3 py-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate">@{nickname}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>

      {/* Public URL */}
      <div className="rounded-md border bg-muted/40 px-3 py-2 space-y-1.5">
        <p className="text-xs text-muted-foreground">Tu wishlist pública</p>
        <div className="flex items-center gap-1">
          <p className="text-xs truncate flex-1 font-mono">/u/{nickname}</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={copyPublicUrl}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copiar enlace</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => window.open(`/u/${nickname}`, "_blank")}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Abrir</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      <Separator className="mb-4" />

      {/* Dark mode toggle */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">
          {theme === "dark" ? "Modo oscuro" : "Modo claro"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-destructive"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>
    </aside>
  );
}
