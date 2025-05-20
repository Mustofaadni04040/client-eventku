import React from "react";
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
          className="sm:max-w-[600px] [&>button]:hidden"
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
