export type Tag = {
  id: string;
  name: string;
  isDefault: boolean;
  userId: string | null;
};

export type WishTag = {
  tag: Tag;
};

export type Wish = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  isPriority: boolean;
  isFulfilled: boolean;
  urls: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: WishTag[];
};
