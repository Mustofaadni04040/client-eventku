import { Input } from "@/components/ui/input";
import React from "react";
import { SelectComponent } from "@/components/ui/Select/index";
import { useDispatch } from "react-redux";
import { CategoryType, TalentType } from "@/types/events.type";
import { usePathname } from "next/navigation";

type PropTypes = {
  keyword: string;
  setKeyword: any;
  keywordCategory?: string;
  setKeywordCategory?: (val: string) => void;
  keywordTalent?: string;
  setKeywordTalent?: (val: string) => void;
  dataCategories?: CategoryType[];
  dataTalents?: TalentType[];
  placeholder: string;
};

export default function Filter({
  keyword,
  setKeyword,
  keywordCategory,
  setKeywordCategory,
  keywordTalent,
  setKeywordTalent,
  dataCategories = [],
  dataTalents = [],
  placeholder,
}: PropTypes) {
  const dispatch = useDispatch();
  const isSelect = ["/events"];
  const pathname = usePathname();

  return (
    <>
      <Input
        type="text"
        name="query"
        value={keyword}
        placeholder={placeholder}
        className="w-[300px]"
        onChange={(e) => dispatch(setKeyword(e.target.value))}
      />

      {isSelect.includes(pathname) && (
        <div className="flex gap-3">
          {setKeywordCategory && (
            <SelectComponent
              value={keywordCategory ?? ""}
              placeholder="Masukan pencarian kategori"
              options={dataCategories}
              handleChange={setKeywordCategory}
            />
          )}
          {setKeywordTalent && (
            <SelectComponent
              value={keywordTalent ?? ""}
              placeholder="Masukan pencarian talent"
              options={dataTalents}
              handleChange={setKeywordTalent}
            />
          )}
        </div>
      )}
    </>
  );
}
