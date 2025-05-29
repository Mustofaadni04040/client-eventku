import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectComponent({
  options,
  placeholder,
  handleChange,
  id,
}: any) {
  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-64" id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option: any, index: number) => (
            <SelectItem
              key={index}
              value={option.value}
              className="hover:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
