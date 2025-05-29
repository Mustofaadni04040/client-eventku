import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Proptypes = {
  children?: React.ReactNode;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  loading?: boolean;
};

export default function Modal({
  children,
  openModal,
  setOpenModal,
  title,
}: Proptypes) {
  return (
    <div>
      <Dialog open={openModal}>
        <DialogContent
          className="modal sm:max-w-[600px] [&>button]:hidden max-h-[80vh] overflow-y-auto"
          onInteractOutside={() => setOpenModal(!openModal)}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}
