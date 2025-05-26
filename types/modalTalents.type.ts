export type ModalTalents = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTalent: {
    _id: string;
    name: string;
    role: string;
    image: { name: string; _id: string };
  } | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data?: { _id: string; name: string }[];
};
