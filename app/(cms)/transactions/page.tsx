"use client";

import Breadcrumbs from "@/components/fragments/Breadcrumb";
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
import { getData } from "@/utils/fetch";
import debounce from "debounce-promise";
import SkeletonComponent from "@/components/fragments/Skeleton";
import moment from "moment";
import PaginationComponent from "@/components/ui/Pagination/index";
import { DatePickerWithRange } from "@/components/ui/DateRange";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";
import Button from "@/components/ui/Button/index";

type PropTypes = {
  _id: string;
  personalDetail: {
    firstName: string;
    lastName: string;
    email: string;
  };
  date: string;
  email: string;
  historyEvent: {
    title: string;
    venueName: string;
  };
};

export default function TalentsPage() {
  const [data, setData] = useState<PropTypes[]>([]);
  const debouncedGetData = useMemo(() => debounce(getData, 1000), []);
  const [loading, setLoading] = useState<boolean>(false);
  const [skeletonCount, setSkeletonCount] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token") || "");
    const getTransactionsAPI = async () => {
      setLoading(true);
      let params;

      params = {
        page: currentPage,
        limit: 10,
        startDate:
          date?.from 
            ? moment(date?.from).format("YYYY-MM-DD")
            : "",
        endDate: date?.to ? moment(date?.to).format("YYYY-MM-DD") : "",
      };

      try {
        const response = await debouncedGetData(`/cms/orders`, params, token);

        setData(response?.data?.data?.order);
        setSkeletonCount(response?.data?.data?.order?.length);
        setTotalPages(response?.data?.data?.pages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getTransactionsAPI();
  }, [debouncedGetData, currentPage, date]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <Breadcrumbs textSecond="Transactions" />

      <div className="mb-5 mt-10">
        <div className="w-full flex items-center gap-3">
          <DatePickerWithRange date={date} setDate={setDate} />
          {date?.from !== undefined && date?.to !== undefined && (
            <Button
              type="button"
              classname="bg-red-500 hover:bg-red-600 w-fit"
              onClick={() => {
                setDate({ from: undefined, to: undefined });
                setCurrentPage(1);
              }}
            >
              <X className="h-4 w-4" />
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
              <TableHead>Email</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Venue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: skeletonCount || 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <SkeletonComponent key={index} columnsCount={6} />
                  </TableRow>
                ))
              : data?.map((item: PropTypes, index: number) => (
                  <TableRow key={`${item?._id}${index}`}>
                    <TableCell className="font-medium">
                      {(currentPage - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {`${item?.personalDetail?.firstName} ${item?.personalDetail?.lastName}`}
                    </TableCell>
                    <TableCell>{item?.personalDetail?.email}</TableCell>
                    <TableCell>{item?.historyEvent?.title}</TableCell>
                    <TableCell>
                      {moment(item?.date).format("DD-MM-YYYY, h:mm:ss a")}
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      {item?.historyEvent?.venueName}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {data?.length > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
