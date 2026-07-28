import React from 'react';

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
        <button
          key={key}
          onClick={() => setInvType(option.value)}
          className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 border ${
            isActive(option.value)
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-gold-400/60 hover:shadow-sm"
          }`}
        >
          {option.value}
        </button>
      ))}
    </div>
  )
}
