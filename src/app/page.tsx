"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateWishModal } from "@/components/wishes/create-wish-modal";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mi Wishlist</h1>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo deseo
          </Button>
        </div>

        <p className="text-muted-foreground">
          Dashboard en construcción — Fase 4
        </p>
      </div>

      <CreateWishModal open={modalOpen} onOpenChange={setModalOpen} />
    </main>
  );
}
