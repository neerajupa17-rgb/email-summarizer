import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmailCategory } from "@shared/schema";

type CategoryFilter = keyof typeof EmailCategory | "ALL";

interface EmailFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  totalCount: number;
  filteredCount: number;
}

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "MEETING", label: "Meeting" },
  { value: "INVOICE", label: "Invoice" },
  { value: "SUPPORT_REQUEST", label: "Support" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "PERSONAL", label: "Personal" },
  { value: "OTHER", label: "Other" },
];

export function EmailFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  totalCount,
  filteredCount,
}: EmailFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span data-testid="text-email-count">
            {filteredCount === totalCount
              ? `${totalCount} ${totalCount === 1 ? "email" : "emails"}`
              : `${filteredCount} of ${totalCount} emails`}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.value}
            variant={categoryFilter === category.value ? "default" : "secondary"}
            className="cursor-pointer hover-elevate active-elevate-2 px-3 py-1.5"
            onClick={() => onCategoryChange(category.value)}
            data-testid={`filter-${category.value.toLowerCase()}`}
          >
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
