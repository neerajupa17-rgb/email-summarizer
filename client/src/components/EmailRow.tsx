import { useState } from "react";
import { EmailSummary } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmailRowProps {
  email: EmailSummary;
}

const categoryColors: Record<string, string> = {
  Meeting: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Invoice: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Support Request": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Newsletter: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Announcement: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Personal: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export function EmailRow({ email }: EmailRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const resumineMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/emails/${email.id}/resummarize`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "emails"] });
      toast({
        title: "Re-summarization complete",
        description: "The email has been re-analyzed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Re-summarization failed",
        description: error instanceof Error ? error.message : "Failed to re-summarize email",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/emails/${email.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api", "emails"] });
      toast({
        title: "Email deleted",
        description: "The email summary has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete email",
        variant: "destructive",
      });
    },
  });

  const handleResummarize = () => {
    resumineMutation.mutate();
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="overflow-hidden hover-elevate transition-all duration-150">
        <div className="lg:grid lg:grid-cols-[1fr_auto_auto] gap-4 p-4 lg:p-6 items-start">
          {/* Email Details */}
          <div className="space-y-2 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base text-foreground truncate" data-testid={`text-subject-${email.id}`}>
                  {email.subject}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span className="font-medium" data-testid={`text-sender-${email.id}`}>{email.sender}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-mono text-xs hidden sm:inline">{email.senderEmail}</span>
                </div>
              </div>
              
              {/* Mobile category badge */}
              <Badge
                className={`lg:hidden shrink-0 ${categoryColors[email.category] || categoryColors.Other}`}
                data-testid={`badge-category-${email.id}`}
              >
                {email.category}
              </Badge>
            </div>

            {/* Summary */}
            <div className="mt-3">
              <p className="text-sm leading-relaxed text-foreground" data-testid={`text-summary-${email.id}`}>
                {email.summary}
              </p>
            </div>

            {/* Expand/Collapse for full email body */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-primary hover:underline mt-2"
              data-testid={`button-expand-${email.id}`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show full email
                </>
              )}
            </button>

            {isExpanded && (
              <div className="mt-3 p-4 bg-muted/50 rounded-md border">
                <p className="text-sm text-foreground whitespace-pre-wrap font-mono" data-testid={`text-body-${email.id}`}>
                  {email.body}
                </p>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground mt-2">
              Processed {formatDistanceToNow(new Date(email.processedAt), { addSuffix: true })}
            </div>
          </div>

          {/* Desktop Category Badge */}
          <div className="hidden lg:flex items-start justify-center w-32">
            <Badge
              className={categoryColors[email.category] || categoryColors.Other}
              data-testid={`badge-category-desktop-${email.id}`}
            >
              {email.category}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-2 mt-4 lg:mt-0 w-full lg:w-32">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResummarize}
              disabled={resumineMutation.isPending}
              className="flex-1 lg:w-full"
              data-testid={`button-resummarize-${email.id}`}
            >
              <RefreshCw className={`h-4 w-4 lg:mr-2 ${resumineMutation.isPending ? "animate-spin" : ""}`} />
              <span className="hidden lg:inline">Re-summarize</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteMutation.isPending}
              className="flex-1 lg:w-full"
              data-testid={`button-delete-${email.id}`}
            >
              <Trash2 className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Delete</span>
            </Button>
          </div>
        </div>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        emailSubject={email.subject}
      />
    </>
  );
}
