import { useCallback, useEffect, useState } from "react";
import { BarChart3, Calendar, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { listTrainerAssessments, publishAssessment } from "./api";
import { LanguageBadge } from "./LanguageBadge";
import type { AssessmentSummary } from "./types";

export function TrainerAssessmentList({ onCreate, onReport }: { onCreate: () => void; onReport: (id: string) => void }) {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    listTrainerAssessments()
      .then(setAssessments)
      .catch((error) => toast({ title: "Could not load assessments", description: error.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(load, [load]);

  const publish = async (id: string) => {
    try {
      await publishAssessment(id);
      toast({ title: "Assessment published", description: "Authorized candidates can now start it." });
      load();
    } catch (error) {
      toast({ title: "Could not publish", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="text-3xl font-bold">Assessments</h2><p className="text-muted-foreground">Create, publish, and report on Java and JavaScript assessments.</p></div>
        <Button onClick={onCreate}><Plus className="h-4 w-4 mr-2" />Create assessment</Button>
      </div>
      {loading ? <p>Loading…</p> : assessments.length === 0 ? <Card><CardContent className="py-10 text-center">No assessments yet.</CardContent></Card> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex justify-between gap-3"><CardTitle>{assessment.name}</CardTitle><LanguageBadge language={assessment.language} /></div>
                <CardDescription>{assessment.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm"><Badge variant="outline">{assessment.status}</Badge><span className="flex items-center gap-1"><Clock className="h-4 w-4" />30 minutes</span>{assessment.scheduled_at && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(assessment.scheduled_at).toLocaleString()}</span>}</div>
                <div className="flex gap-2">
                  {assessment.status === "draft" && <Button size="sm" onClick={() => void publish(assessment.id)}>Publish</Button>}
                  <Button size="sm" variant="outline" onClick={() => onReport(assessment.id)}><BarChart3 className="h-4 w-4 mr-2" />Report</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
