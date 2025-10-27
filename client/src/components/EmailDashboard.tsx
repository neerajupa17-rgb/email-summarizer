import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmailSummary, EmailCategory } from "@shared/schema";
import { EmailTable } from "./EmailTable";
import { EmailFilters } from "./EmailFilters";
import { DashboardHeader } from "./DashboardHeader";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type CategoryFilter = keyof typeof EmailCategory | "ALL";

export function EmailDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { data: emails, isLoading, error } = useQuery<EmailSummary[]>({
    queryKey: ["/api", "emails"],
  });

  const handleProcessEmails = async () => {
    setIsProcessing(true);
    try {
      await apiRequest("POST", "/api/emails/process");
      queryClient.invalidateQueries({ queryKey: ["/api", "emails"] });
      toast({
        title: "Processing complete",
        description: "Mock emails have been summarized and categorized successfully.",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process emails",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter emails based on search and category
  const filteredEmails = emails?.filter((email) => {
    const matchesSearch =
      searchQuery === "" ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.senderEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || email.category === EmailCategory[categoryFilter];

    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Failed to load emails
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <Button onClick={() => window.location.reload()} data-testid="button-retry">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const hasEmails = emails && emails.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {!hasEmails ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <EmptyState
              icon={Inbox}
              title="No emails to display"
              description="Process mock emails to get started with AI-powered summarization"
            />
            <Button
              onClick={handleProcessEmails}
              disabled={isProcessing}
              size="lg"
              className="mt-6"
              data-testid="button-process-emails"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Mock Emails"
              )}
            </Button>
          </div>
        ) : (
          <>
            <EmailFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              totalCount={emails.length}
              filteredCount={filteredEmails.length}
            />

            <div className="mt-6">
              {filteredEmails.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No matching emails"
                  description="Try adjusting your search or filter to find what you're looking for"
                />
              ) : (
                <EmailTable emails={filteredEmails} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
