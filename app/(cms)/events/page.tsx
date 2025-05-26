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
import ModalUpdatePayment from "@/components/fragments/ModalUpdatePayment";
import ModalDeletePayment from "@/components/fragments/ModalDeletePayment";
import { CategoryType, EventType, TalentType } from "@/types/events.type";
import { formatDate } from "@/utils/formatDate";
import Input from "@/components/ui/Input/index";
import { setKeyword } from "@/redux/keyword/keywordSlice";
import { SelectComponent } from "@/components/ui/Select/index";
import SkeletonComponent from "@/components/fragments/Skeleton";

type TypeModal = "edit" | "delete" | null;

export default function EventsPage() {
  const [dataEvents, setDataEvents] = useState<EventType[]>([]);
  const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);
  const [dataTalents, setDataTalents] = useState<TalentType[]>([]);
  const [keywordCategory, setKeywordCategory] = useState<string>("");
  const [keywordTalent, setKeywordTalent] = useState<string>("");
  const debouncedGetData = useMemo(() => debounce(getData, 1000), []);
  const { keyword } = useSelector((state: any) => state.keyword);
  const [loading, setLoading] = useState<boolean>(false);
  const [skeletonCount, setSkeletonCount] = useState<number>(5);
  const role = useSelector((state: any) => state.auth.role);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<TypeModal>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType>();

  useEffect(() => {
    const getEventsAPI = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem("token") || "");
        let params = {
          keyword: keyword || "",
          category: keywordCategory || "",
          talent: keywordTalent || "",
        };
        const response = await debouncedGetData(`/cms/events`, params, token);

        setDataEvents(response?.data?.data);
        setSkeletonCount(response?.data?.data?.length);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getEventsAPI();
  }, [debouncedGetData, keyword, keywordCategory, keywordTalent]);

  useEffect(() => {
    const getCategoriesAPI = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token") || "");
        const response = await getData(`/cms/categories`, undefined, token);

        let _temp: any = [];

        response?.data?.data?.map((item: { _id: string; name: string }) => {
          _temp.push({
            value: item._id,
            label: item.name,
          });
        });

        setDataCategories(_temp);
      } catch (error) {
        console.log(error);
      }
    };

    getCategoriesAPI();
  }, []);

  useEffect(() => {
    const getTalentsAPI = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token") || "");
        const response = await getData(`/cms/talents`, undefined, token);

        let _temp: any = [];

        response?.data?.data?.map((item: { _id: string; name: string }) => {
          _temp.push({
            value: item._id,
            label: item.name,
          });
        });

        setDataTalents(_temp);
      } catch (error) {
        console.log(error);
      }
    };

    getTalentsAPI();
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <Breadcrumbs textSecond="payments" />

      <div className="mb-5 mt-10">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Input
              type="text"
              name="query"
              value={keyword}
              placeholder="Cari berdasarkan nama events"
              className="w-[300px]"
              onChange={(e) => dispatch(setKeyword(e.target.value))}
            />

            <SelectComponent
              value={keywordCategory}
              placeholder="Masukan pencarian kategori"
              options={dataCategories}
              handleChange={(e: string) => setKeywordCategory(e)}
            />
            <SelectComponent
              value={keywordTalent}
              placeholder="Masukan pencarian talent"
              options={dataTalents}
              handleChange={(e: string) => setKeywordTalent(e)}
            />
          </div>

          {isHasAccess(accessTalents.tambah, role) && (
            <Button type="button" classname="bg-primary hover:bg-primary/90">
              <Link href="/payments/create">Tambah</Link>
            </Button>
          )}
        </div>

        <Table className="my-5">
          <TableCaption>A list of events.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              {loading ? null : <TableHead></TableHead>}
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: skeletonCount || 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <SkeletonComponent key={index} columnsCount={7} />
                  </TableRow>
                ))
              : dataEvents?.map((item: EventType, index: number) => (
                  <TableRow key={`${item?._id}${index}`}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{item?.title}</TableCell>
                    <TableCell>{formatDate(item?.date, true)}</TableCell>
                    <TableCell>{item?.venueName}</TableCell>
                    <TableCell>{item?.category?.name}</TableCell>
                    <TableCell>{item?.talent?.name}</TableCell>
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
                                setSelectedEvent(item);
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
                                setSelectedEvent(item);
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* {modalType === "edit" && (
        <ModalUpdatePayment
          loading={loading}
          setLoading={setLoading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedEvent={selectedEvent}
          setDataEvents={setDataEvents}
        />
      )}

      {modalType === "delete" && (
        <ModalDeletePayment
          openModal={openModal}
          setOpenModal={setOpenModal}
          loading={loading}
          setLoading={setLoading}
          selectedEvent={selectedEvent}
          setDataEvents={setDataEvents}
          data={data}
        />
      )} */}
    </div>
  );
}
