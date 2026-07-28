import React from 'react';

const industryOptions = [
  { key: "All", text: "All", value: "All" },
  { key: "Adtech", text: "Adtech", value: "Adtech" },
  { key: "Automotive", text: "Automotive", value: "Automotive" },
  { key: "Biotech", text: "Biotech", value: "Biotech" },
  { key: "Construction", text: "Construction", value: "Construction" },
  { key: "Customer Support", text: "Customer Support", value: "Customer Support" },
  { key: "Domain Names", text: "Domain Names", value: "Domain Names" },
  { key: "Ecommerce", text: "Ecommerce", value: "Ecommerce" },
  { key: "Education", text: "Education", value: "Education" },
  { key: "Enterprise Software", text: "Enterprise Software", value: "Enterprise Software" },
  { key: "Fashion", text: "Fashion", value: "Fashion" },
  { key: "Finance", text: "Finance", value: "Finance" },
  { key: "Gaming", text: "Gaming", value: "Gaming" },
  { key: "Healthcare", text: "Healthcare", value: "Healthcare" },
  { key: "HR / Recruitment", text: "HR / Recruitment", value: "HR / Recruitment" },
  { key: "Infrastructure", text: "Infrastructure", value: "Infrastructure" },
  { key: "Insurance", text: "Insurance", value: "Insurance" },
  { key: "Logistics / Transport", text: "Logistics / Transport", value: "Logistics / Transport" },
  { key: "Marketing", text: "Marketing", value: "Marketing" },
  { key: "Marketplace", text: "Marketplace", value: "Marketplace" },
  { key: "Media / Entertainment", text: "Media / Entertainment", value: "Media / Entertainment" },
  { key: "Real Estate", text: "Real Estate", value: "Real Estate" },
  { key: "Renewable Energy", text: "Renewable Energy", value: "Renewable Energy" },
  { key: "Social", text: "Social", value: "Social" },
  { key: "Software", text: "Software", value: "Software" },
  { key: "Telecom", text: "Telecom", value: "Telecom" },
  { key: "Travel / Tourism", text: "Travel / Tourism", value: "Travel / Tourism", },
  { key: "Web Hosting", text: "Web Hosting", value: "Web Hosting" },
]

export default function IndustryButtons({ industry, setIndustry, label }: {
  industry: string | string[],
  setIndustry: (industry: string) => void,
  label: string,
}) {

  let validOption: boolean = false;
  {
    industryOptions.forEach((option, key) => {
      if (industry.toString().toLowerCase() == option.value.toLowerCase()) {
        validOption = true
        return validOption
      }
    })
  }

  const isActive = (value: string) => {
    return !validOption && value.toLowerCase() === "all"
      ? true
      : industry.toString().toLowerCase() === value.toLowerCase();
  };

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2 py-4 justify-center">
      {industryOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setIndustry(option.value)}
          aria-pressed={isActive(option.value)}
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
