"use client";

import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { Moon, Sun, LogOut, Copy, Check, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  onClose?: () => void;
};

export function Sidebar({ onClose }: Props) {
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
    <aside className="w-64 h-screen flex flex-col border-r bg-card shrink-0">
      {/* Logo header */}
      <div className="px-5 py-5 flex items-center justify-between border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <Logo size="lg" />
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">@{nickname}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        {/* Public URL */}
        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tu wishlist pública</p>
          <div className="flex items-center gap-1">
            <p className="text-xs truncate flex-1 text-primary font-medium">/u/{nickname}</p>
            <Tooltip>
              <TooltipTrigger
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                onClick={copyPublicUrl}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </TooltipTrigger>
              <TooltipContent>Copiar enlace</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                onClick={() => window.open(`/u/${nickname}`, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Abrir en nueva pestaña</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-5 pt-2 border-t space-y-1">
        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-sm text-muted-foreground"
        >
          <span>{theme === "dark" ? "Modo oscuro" : "Modo claro"}</span>
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
