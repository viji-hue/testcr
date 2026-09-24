import { useState } from "react";
import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestCreator } from "@/components/TestCreator";
import { useAuth } from "@/contexts/AuthContext";
import { TrainerAssessmentList } from "@/features/assessments/TrainerAssessmentList";
import { TrainerReport } from "@/features/assessments/TrainerReport";

type TrainerView = "assessments" | "create" | "report";

const TrainerPage = () => {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<TrainerView>("assessments");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const displayName = user?.user_metadata?.name || user?.email || "Trainer";

  const openReport = (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);
    setView("report");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center"><UserCircle className="h-6 w-6 text-white" /></div><div><h1 className="font-bold">Test Crafter</h1><p className="text-xs text-muted-foreground">Trainer: {displayName}</p></div></div>
          <Button variant="outline" size="sm" onClick={() => void signOut()}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
        </div>
      </header>
      {view === "assessments" && <TrainerAssessmentList onCreate={() => setView("create")} onReport={openReport} />}
      {view === "create" && <TestCreator onBack={() => setView("assessments")} onSaved={() => setView("assessments")} />}
      {view === "report" && selectedAssessmentId && <TrainerReport assessmentId={selectedAssessmentId} onBack={() => setView("assessments")} />}
    </div>
  );
};

export default TrainerPage;
