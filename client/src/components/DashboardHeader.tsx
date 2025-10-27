import { Mail } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Email Workflow
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI-Powered Summarization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>AI Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
