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
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { accessTalents } from "@/utils/access";
import { isHasAccess } from "@/utils/hasAccess";
import Image from "next/image";
import { config } from "@/configs";

type PropTypes = {
  _id: string;
  type: string;
  image: { name: string; _id: string };
};

type TypeModal = "edit" | "delete" | null;

export default function PaymentsPage() {
  const [data, setData] = useState<PropTypes[]>([]);
  const debouncedGetData = useMemo(() => debounce(getData, 1000), []);
  const [loading, setLoading] = useState<boolean>(false);
  const [skeletonCount, setSkeletonCount] = useState<number>(5);
  const role = useSelector((state: any) => state.auth.role);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TypeModal>(null);
  const [selectedTalent, setSelectedTalent] = useState<{
    _id: string;
    type: string;
    image: { name: string; _id: string };
  } | null>(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token") || "");
    const getCategoriesAPI = async () => {
      setLoading(true);
      try {
        const response = await debouncedGetData(
          `/cms/payments`,
          undefined,
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

    getCategoriesAPI();
  }, [debouncedGetData]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <Breadcrumbs textSecond="payments" />

      <div className="mb-5 mt-10">
        <div className="w-full flex justify-end">
          {isHasAccess(accessTalents.tambah, role) && (
            <Button type="button" classname="bg-primary hover:bg-primary/90">
              <Link href="/talents/create">Tambah</Link>
            </Button>
          )}
        </div>

        <Table className="my-5">
          <TableCaption>A list of payments method.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead></TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: skeletonCount || 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.map(
                  (
                    item: {
                      _id: string;
                      type: string;
                      image: { name: string; _id: string };
                    },
                    index: number
                  ) => (
                    <TableRow key={`${item?._id}${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{item?.type}</TableCell>
                      <TableCell>
                        <Image
                          src={
                            item?.image?.name
                              ? `${config.api_image}/${item?.image?.name}`
                              : "/default.jpeg"
                          }
                          width={50}
                          height={50}
                          alt={`${item?.type} profile`}
                          className="w-14 h-auto object-cover"
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
    </div>
  );
}
