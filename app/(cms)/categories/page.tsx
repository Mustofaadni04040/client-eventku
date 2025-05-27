"use client";

import Breadcrumbs from "@/components/fragments/Breadcrumb";
import Button from "@/components/ui/Button/index";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getData } from "@/utils/fetch";
import debounce from "debounce-promise";
import { useSelector } from "react-redux";
import { accessCategories } from "@/utils/access";
import ModalUpdateCategories from "@/components/fragments/ModalUpdateCategories";
import ModalDeleteCategories from "@/components/fragments/ModalDeleteCategories";
import { isHasAccess } from "@/utils/hasAccess";
import SkeletonComponent from "@/components/fragments/Skeleton";

type PropTypes = {
  _id: string;
  name: string;
};

type TypeModal = "edit" | "delete" | null;

export default function CategoriesPage() {
  const [data, setData] = useState<PropTypes[]>([]);
  const debouncedGetData = useMemo(() => debounce(getData, 1000), []);
  const [loading, setLoading] = useState<boolean>(false);
  const [skeletonCount, setSkeletonCount] = useState<number>(5);
  const role = useSelector((state: any) => state.auth.role);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TypeModal>(null);
  const [selectedCategories, setSelectedCategories] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token") || "");
    const getCategoriesAPI = async () => {
      setLoading(true);
      try {
        const response = await debouncedGetData(`/cms/categories`, null, token);
        setData(response?.data?.data);
        setSkeletonCount(response?.data?.data?.length);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getCategoriesAPI();
  }, [debouncedGetData]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <Breadcrumbs textSecond="categories" />

      <div className="my-5">
        <div className="w-full flex justify-end">
          {isHasAccess(accessCategories.tambah, role) && (
            <Button type="button" classname="bg-primary hover:bg-primary/90">
              <Link href="/categories/create">Tambah</Link>
            </Button>
          )}
        </div>

        <Table className="my-5">
          <TableCaption>A list of categories event.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              {loading ? null : <TableHead></TableHead>}
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: skeletonCount || 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <SkeletonComponent key={index} columnsCount={3} />
                  </TableRow>
                ))
              : data?.map(
                  (item: { _id: string; name: string }, index: number) => (
                    <TableRow key={`${item?._id}${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell className="text-right flex justify-end">
                        <div className="flex items-center gap-3">
                          {isHasAccess(
                            accessCategories.edit || accessCategories.hapus,
                            role
                          ) && (
                            <>
                              <Button
                                type="button"
                                classname="bg-transparent border border-primary text-primary hover:bg-slate-100"
                                onClick={() => {
                                  setOpenModal(!openModal);
                                  setModalType("edit");
                                  setSelectedCategories(item);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                classname="bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                  setOpenModal(!openModal);
                                  setModalType("delete");
                                  setSelectedCategories(item);
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
          </TableBody>
        </Table>
      </div>

      {modalType === "edit" && (
        <ModalUpdateCategories
          loading={loading}
          setLoading={setLoading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedCategories={selectedCategories}
          setData={setData}
        />
      )}

      {modalType === "delete" && (
        <ModalDeleteCategories
          loading={loading}
          setLoading={setLoading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedCategories={selectedCategories}
          setData={setData}
          data={data}
        />
      )}
    </div>
  );
}
