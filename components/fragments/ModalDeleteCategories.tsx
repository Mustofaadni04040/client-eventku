import React, { useContext, useState } from "react";
import Modal from "../layout/modalLayout";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Button from "../ui/Button/index";
import { deleteData, putData } from "@/utils/fetch";
import { ToasterContext } from "@/context/ToasterContext";

type PropTypes = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCategories: { _id: string; name: string } | null;
  setData: React.Dispatch<React.SetStateAction<any>>;
  data: { _id: string; name: string }[];
};

export default function ModalDeleteCategories({
  openModal,
  setOpenModal,
  loading,
  setLoading,
  selectedCategories,
  setData,
  data,
}: PropTypes) {
  const { setToaster } = useContext(ToasterContext);

  async function onSubmit() {
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("token") || "");
      const res = await deleteData(
        `/cms/categories/${selectedCategories?._id}`,
        token
      );

      if (res?.status === 200) {
        setOpenModal(false);
        setData(
          data.filter(
            (item: { _id: string; name: string }) =>
              item._id !== selectedCategories?._id
          )
        );
        setToaster({
          variant: "success",
          message: "Kategori berhasil dihapus",
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
      title="Delete Categories"
    >
      <div>
        <p>
          Apakah anda yakin ingin menghapus kategori{" "}
          <b>{selectedCategories?.name}</b>
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
