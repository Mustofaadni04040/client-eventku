import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type PropTypes = {
  textThird?: string;
  textSecond?: string;
  urlSecond?: string | any;
};

export default function Breadcrumbs({
  textThird,
  textSecond,
  urlSecond,
}: PropTypes) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/dashboard">Home</Link>
        </BreadcrumbItem>
        {!textThird && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{textSecond}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {textThird && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={urlSecond || "#"}>{textSecond}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {textThird && (
          <>
            <BreadcrumbItem>
              <BreadcrumbPage>{textThird}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
