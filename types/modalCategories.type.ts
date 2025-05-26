export type ModalCategories = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategories: { _id: string; name: string } | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data?: { _id: string; name: string }[];
};
