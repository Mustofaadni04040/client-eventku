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
import { accessTalents } from "@/utils/access";
import { isHasAccess } from "@/utils/hasAccess";
import { setKeyword } from "@/redux/keyword/keywordSlice";
import Image from "next/image";
import { config } from "@/configs";
import SkeletonComponent from "@/components/fragments/Skeleton";
import Filter from "@/components/fragments/Filter/Filter";
import ModalUpdateTalent from "@/components/fragments/Talent/ModalUpdateTalent";
import ModalDeleteTalent from "@/components/fragments/Talent/ModalDeleteTalent";

type PropTypes = {
  _id: string;
  name: string;
  role: string;
  image: { name: string; _id: string };
};

type TypeModal = "edit" | "delete" | null;

export default function TalentsPage() {
  const [data, setData] = useState<PropTypes[]>([]);
  const debouncedGetData = useMemo(() => debounce(getData, 1000), []);
  const [loading, setLoading] = useState<boolean>(false);
  const [skeletonCount, setSkeletonCount] = useState<number>(5);
  const role = useSelector((state: any) => state.auth.role);
  const { keyword } = useSelector((state: any) => state.keyword);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TypeModal>(null);
  const [selectedTalent, setSelectedTalent] = useState<{
    _id: string;
    name: string;
    role: string;
    image: { name: string; _id: string };
  } | null>(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token") || "");
    const getTalentsAPI = async () => {
      setLoading(true);
      try {
        const response = await debouncedGetData(
          `/cms/talents`,
          { keyword },
          token
        );

        setData(response?.data?.data);
        setSkeletonCount(response?.data?.data?.length);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getTalentsAPI();
  }, [debouncedGetData, keyword]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <Breadcrumbs textSecond="talents" />

      <div className="mb-5 mt-10">
        <div className="w-full flex justify-between items-center">
          <Filter
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Cari berdasarkan nama talent"
          />

          {isHasAccess(accessTalents.tambah, role) && (
            <Button type="button" classname="bg-primary hover:bg-primary/90">
              <Link href="/talents/create">Tambah</Link>
            </Button>
          )}
        </div>

        <Table className="my-5">
          <TableCaption>A list of talents event.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              {loading ? null : <TableHead></TableHead>}
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Profile Photo</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: skeletonCount || 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <SkeletonComponent key={index} columnsCount={5} />
                  </TableRow>
                ))
              : data?.map(
                  (
                    item: {
                      _id: string;
                      name: string;
                      role: string;
                      image: { name: string; _id: string };
                    },
                    index: number
                  ) => (
                    <TableRow key={`${item?._id}${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>{item?.role}</TableCell>
                      <TableCell>
                        <Image
                          src={
                            item?.image?.name
                              ? `${config.api_image}/${item?.image?.name}`
                              : "/default.jpeg"
                          }
                          width={50}
                          height={50}
                          alt={`${item?.name} profile`}
                          className="rounded-full w-14 h-14 object-cover"
                        />
                      </TableCell>
                      <TableCell className="text-right flex justify-end">
                        <div className="flex items-center gap-3">
                          {isHasAccess(
                            accessTalents.edit || accessTalents.hapus,
                            role
                          ) && (
                            <>
                              <Button
                                type="button"
                                classname="bg-transparent border border-primary text-primary hover:bg-slate-100"
                                onClick={() => {
                                  setOpenModal(!openModal);
                                  setModalType("edit");
                                  setSelectedTalent(item);
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
                                  setSelectedTalent(item);
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
        <ModalUpdateTalent
          loading={loading}
          setLoading={setLoading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedTalent={selectedTalent}
          setData={setData}
        />
      )}

      {modalType === "delete" && (
        <ModalDeleteTalent
          loading={loading}
          setLoading={setLoading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedTalent={selectedTalent}
          setData={setData}
          data={data}
        />
      )}
    </div>
  );
}
