import { EmailSummary } from "@shared/schema";
import { EmailRow } from "./EmailRow";
import { Card } from "@/components/ui/card";

interface EmailTableProps {
  emails: EmailSummary[];
}

export function EmailTable({ emails }: EmailTableProps) {
  return (
    <div className="space-y-3">
      {/* Desktop table header */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 border-b bg-muted/30 rounded-t-md">
        <div className="text-sm font-medium text-muted-foreground">Email Details</div>
        <div className="text-sm font-medium text-muted-foreground w-32 text-center">Category</div>
        <div className="text-sm font-medium text-muted-foreground w-32 text-center">Actions</div>
      </div>

      {/* Email rows */}
      <div className="space-y-3">
        {emails.map((email) => (
          <EmailRow key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
}
