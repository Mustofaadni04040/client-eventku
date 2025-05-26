import React, { useContext } from "react";
import Modal from "../layout/modalLayout";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Button from "../ui/Button/index";
import { deleteData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";
import { ModalTalents } from "@/types/modalTalents.type";

export default function ModalDeleteTalent({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedTalent,
  setData,
  data,
}: ModalTalents) {
  const { setToaster } = useContext(ToasterContext);

  async function onSubmit() {
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const res = await deleteData(
        `/cms/talents/${selectedTalent?._id}`,
        token
      );

      if (res?.status === 200) {
        setOpenModal(false);
        setData(
          data &&
            data.filter(
              (item: { _id: string; name: string }) =>
                item._id !== selectedTalent?._id
            )
        );
        setToaster({
          variant: "success",
          message: "Talent berhasil dihapus",
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
          Kamu yakin ingin menghapus talent <b>{selectedTalent?.name}</b>?
          <span className="text-red-500 text-[13px] block">
            Talent yang terhapus tidak dapat dikembalikan*
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
