export type RsvpSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type RsvpStoreData = {
  submissions: RsvpSubmission[];
};
