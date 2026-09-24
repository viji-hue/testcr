import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CandidateAssessments } from "@/features/assessments/CandidateAssessments";

const StudentPage = () => {
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email || "Candidate";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Test Crafter</h1>
              <p className="text-xs text-muted-foreground">Candidate: {displayName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            <LogOut className="h-4 w-4 mr-2" />Sign out
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8"><CandidateAssessments /></main>
    </div>
  );
};

export default StudentPage;
