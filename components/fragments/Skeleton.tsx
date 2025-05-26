import React from "react";
import { TableCell } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export default function SkeletonComponent({
  columnsCount,
}: {
  columnsCount: number;
}) {
  return (
    <>
      {Array.from({ length: columnsCount }).map((_, index) => (
        <TableCell
          key={index}
          className={index + 1 === columnsCount ? "flex justify-end" : ""}
        >
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
      ))}
    </>
  );
}
