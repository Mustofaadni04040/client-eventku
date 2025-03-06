import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";

type Proptypes = {
  children: React.ReactNode;
  onClose: any;
};

export default function Modal({ children, onClose }: Proptypes) {
  const ref: any = useRef();

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 h-screen w-screen z-[1000] bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-500 flex items-center justify-center">
      <div
        className="relative bg-white p-5 w-[500px] overflow-y-auto rounded-2xl"
        ref={ref}
      >
        <button onClick={onClose}>
          <i className="bx bx-x top-3 right-3 absolute text-2xl text-slate-500" />
        </button>
        {children}
      </div>
    </div>
  );
}
