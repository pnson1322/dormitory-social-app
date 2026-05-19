export type CreateIncidentRequest = {
  RoomId: string;
  CategoryId: string;
  Description: string;
  Images?: string[];
};

export type IncidentResponse = {
  id: string;
  roomId: string;
  reporterId?: string;
  categoryName?: string;
  categoryId: string;
  description: string;
  status: string;
  createdAt: string;
  imageUrls?: string[];
};

export type IncidentCategoryResponse = {
  id: string;
  name: string;
};
