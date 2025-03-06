"use client";

import Breadcrumbs from "@/components/fragments/Breadcrumb";
import Button from "@/components/ui/Button/index";
import WithAuth from "@/components/ui/withAuth";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { config } from "@/configs";
import Link from "next/link";
import AxiosInstance from "@/utils/axiosInstance";

type PropTypes = {
  _id: string;
  name: string;
};

export default function CategoriesPage() {
  const [data, setData] = useState<PropTypes[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token")?.split('"')[1];
    const getCategoriesAPI = async () => {
      try {
        const response = await AxiosInstance.get(
          `${config.api_host_dev}/cms/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCategoriesAPI();
  }, []);

  return (
    <WithAuth>
      <div className="container mx-auto my-10">
        <Breadcrumbs textSecond="categories" />

        <div className="my-5">
          <div className="w-full flex justify-end">
            <Button type="button" classname="bg-primary hover:bg-primary/90">
              <Link href="/categories/create">Tambah</Link>
            </Button>
          </div>

          <Table className="my-5">
            <TableCaption>A list of categories event.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(
                (item: { _id: string; name: string }, index: number) => (
                  <TableRow key={`${item._id}${index}`}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      <i className="bx bx-dots-horizontal-rounded" />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </WithAuth>
  );
}
