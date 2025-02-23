// types.ts
export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};

export type RootStackParamList = {
  List: undefined;
  Detail: { data: Post };
  Profile: undefined;
  Favorites: undefined;
  Search: undefined;
};

export type ThemeType = 'light' | 'dark';