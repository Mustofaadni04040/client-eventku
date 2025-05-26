export type ImageType = {
  _id: string;
  name: string;
};

export type CategoryType = {
  _id: string;
  name: string;
};

export type TalentType = {
  _id: string;
  name: string;
  role: string;
  image: ImageType;
};

export type TicketType = {
  _id: string;
  type: string;
  price: number;
  stock: number;
  statusTicketCategories: boolean;
};

export type EventType = {
  _id?: string;
  title: string;
  tagline?: string;
  venueName: string;
  statusEvent?: string;
  date: string;
  about?: string;
  keyPoint?: string[];
  image?: ImageType;
  category: CategoryType;
  talent: TalentType;
  tickets?: TicketType[];
  organizer?: string;
  createdAt?: string;
  updatedAt?: string;
};
