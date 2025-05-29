import { EventType } from "./events.type";

export type ModalEvents = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: EventType | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data?: { _id: string; name: string }[];
};
