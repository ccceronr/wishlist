import { create } from "zustand";
import type { Wish, Tag } from "@/types/wish";

type WishStore = {
  wishes: Wish[];
  tags: Tag[];
  setWishes: (wishes: Wish[]) => void;
  setTags: (tags: Tag[]) => void;
  addWish: (wish: Wish) => void;
  updateWish: (wish: Wish) => void;
  removeWish: (id: string) => void;
  addTag: (tag: Tag) => void;
};

export const useWishStore = create<WishStore>((set) => ({
  wishes: [],
  tags: [],
  setWishes: (wishes) => set({ wishes }),
  setTags: (tags) => set({ tags }),
  addWish: (wish) =>
    set((state) => ({
      wishes: [wish, ...state.wishes].sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    })),
  updateWish: (wish) =>
    set((state) => ({
      wishes: state.wishes
        .map((w) => (w.id === wish.id ? wish : w))
        .sort((a, b) => {
          if (a.isPriority && !b.isPriority) return -1;
          if (!a.isPriority && b.isPriority) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    })),
  removeWish: (id) =>
    set((state) => ({ wishes: state.wishes.filter((w) => w.id !== id) })),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
}));
