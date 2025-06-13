import React, { useContext } from "react";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { deleteData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import Modal from "@/components/layout/modalLayout";
import Button from "@/components/ui/Button/index";
import { EventType } from "@/types/events.type";

export default function ModalDeleteEvent({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedEvent,
  setData,
  data,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: EventType | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: any;
}) {
  const { setToaster } = useContext(ToasterContext);

  async function onSubmit() {
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const res = await deleteData(`/cms/events/${selectedEvent?._id}`, token);

      if (res?.status === 200) {
        setOpenModal(false);
        setData(
          data &&
            data.filter(
              (item: { _id: string; name: string }) =>
                item._id !== selectedEvent?._id
            )
        );
        setToaster({
          variant: "success",
          message: "Event berhasil dihapus",
        });
      }
    } catch (err: any) {
      console.log(err);
      setToaster({
        variant: "danger",
        message: err?.response?.data?.msg || "Internal Server Error",
      });
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  }

  return (
    <Modal
      openModal={openModal}
      setOpenModal={setOpenModal}
      title="Apakah kamu yakin?"
    >
      <div>
        <p>
          Kamu yakin ingin menghapus event <b>{selectedEvent?.title}</b>?
          <span className="text-red-500 text-[13px] block">
            Event yang terhapus tidak dapat dikembalikan*
          </span>
        </p>
      </div>
      <DialogFooter className="sm:justify-end mt-5">
        <DialogClose asChild>
          <Button
            classname="bg-transparent border border-primary text-primary hover:bg-slate-100"
            type="button"
            onClick={() => setOpenModal(!openModal)}
          >
            Close
          </Button>
        </DialogClose>
        <Button
          type="button"
          classname="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          onClick={() => onSubmit()}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </Modal>
  );
}
