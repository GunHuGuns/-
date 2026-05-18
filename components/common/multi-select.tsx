"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "选择...",
  emptyText = "没有找到选项",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === filteredOptions.length) {
      // 如果当前筛选结果全部选中，则取消选中
      onChange(selected.filter((item) => !filteredOptions.includes(item)));
    } else {
      // 否则全选当前筛选结果
      const newSelected = [...new Set([...selected, ...filteredOptions])];
      onChange(newSelected);
    }
  };

  const handleInvertSelection = () => {
    const newSelected = filteredOptions.filter(
      (option) => !selected.includes(option)
    );
    const otherSelected = selected.filter(
      (item) => !filteredOptions.includes(item)
    );
    onChange([...otherSelected, ...newSelected]);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const isAllSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((option) => selected.includes(option));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-auto min-h-10 w-full justify-between",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selected.map((value) => (
                <Badge
                  key={value}
                  variant="secondary"
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(value);
                  }}
                >
                  {value}
                  <X className="ml-1 size-3 cursor-pointer" />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 size-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="搜索..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 text-xs"
            >
              {isAllSelected ? "取消全选" : "全选"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInvertSelection}
              className="h-7 text-xs"
            >
              反选
            </Button>
            {selected.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                清空
              </Button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              已选 {selected.length} 项
            </span>
          </div>
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selected.includes(option) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
