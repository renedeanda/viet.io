import React from 'react';
import { Button } from '@/components/ui/button';

const invTypeOptions = [
  { key: "All", text: "All", value: "All" },
  { key: "Accelerator / Incubator", text: "Accelerator / Incubator", value: "Accelerator / Incubator" },
  { key: "Angel", text: "Angel", value: "Angel" },
  { key: "Corporate Venture Capital", text: "Corporate Venture Capital", value: "Corporate Venture Capital" },
  { key: "Private Equity", text: "Private Equity", value: "Private Equity" },
  { key: "Venture Capital", text: "Venture Capital", value: "Venture Capital" }
]

export default function InvTypeButtons({ invType, filteredLength, setInvType }: {
  invType: string | string[],
  filteredLength: number,
  setInvType: any
}) {

  let validOption: boolean = false;
  {
    invTypeOptions.forEach((option, key) => {
      if (invType.toString().toLowerCase() == option.value.toLowerCase()) {
        validOption = true
        return validOption
      }
    })
  }

  const isActive = (value: string) => {
    return !validOption && value.toLowerCase() === "all"
      ? true
      : invType.toString().toLowerCase() === value.toLowerCase();
  };

  return (
    <div className="flex flex-wrap gap-2 py-4 justify-center">
      {invTypeOptions.map((option, key) => (
        <Button
          key={key}
          variant={isActive(option.value) ? "default" : "outline"}
          size="sm"
          onClick={() => setInvType(option.value)}
          className={`rounded-full transition-all ${
            isActive(option.value)
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {option.value}
        </Button>
      ))}
    </div>
  )
}