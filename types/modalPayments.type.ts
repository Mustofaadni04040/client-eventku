export type ModalPayments = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPayment: {
    _id: string;
    type: string;
    image: { name: string; _id: string };
  } | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data?: { _id: string; type: string; image: { name: string; _id: string } }[];
};
