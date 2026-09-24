import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { autosaveAnswer, listAvailableAssessments, startAttempt, submitAttempt } from "./api";
import { LanguageBadge } from "./LanguageBadge";
import { formatRemaining, remainingSeconds, serverClockOffset, warningForTransition } from "./timing";
import type { AssessmentSummary, StartedAttempt } from "./types";

const ACTIVE_ASSESSMENT_KEY = "test-crafter-active-assessment";

async function withRetry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts - 1) await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
    }
  }
  throw lastError;
}

export function CandidateAssessments() {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [attempt, setAttempt] = useState<StartedAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [remaining, setRemaining] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "offline">("idle");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const revisions = useRef<Record<string, number>>({});
  const previousRemaining = useRef(0);
  const serverOffset = useRef(0);
  const submitting = useRef(false);

  const finish = useCallback(async (mode: "manual" | "automatic") => {
    if (!attempt || submitting.current) return;
    submitting.current = true;
    try {
      const submission = await withRetry(() => submitAttempt(attempt.attemptId, mode));
      sessionStorage.removeItem(ACTIVE_ASSESSMENT_KEY);
      setResult(submission);
      setAttempt(null);
      toast({ title: mode === "automatic" ? "Time expired" : "Assessment submitted", description: "Your submission was recorded safely." });
    } catch (error) {
      toast({ title: "Submission pending", description: error instanceof Error ? error.message : "Reconnect to submit again.", variant: "destructive" });
    } finally {
      submitting.current = false;
    }
  }, [attempt, toast]);

  const begin = useCallback(async (assessmentId: string) => {
    setLoading(true);
    try {
      const started = await startAttempt(assessmentId);
      if (started.status !== "in_progress") {
        sessionStorage.removeItem(ACTIVE_ASSESSMENT_KEY);
        setResult({ status: started.status, submittedAt: started.submittedAt });
        return;
      }
      serverOffset.current = serverClockOffset(started.serverNow);
      const nextRemaining = remainingSeconds(started.expiresAt, Date.now() + serverOffset.current);
      previousRemaining.current = nextRemaining;
      setRemaining(nextRemaining);
      setAttempt(started);
      sessionStorage.setItem(ACTIVE_ASSESSMENT_KEY, assessmentId);
    } catch (error) {
      toast({ title: "Unable to start assessment", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    listAvailableAssessments()
      .then((available) => {
        setAssessments(available);
        const activeId = sessionStorage.getItem(ACTIVE_ASSESSMENT_KEY);
        if (activeId && available.some((item) => item.id === activeId)) void begin(activeId);
      })
      .catch((error) => toast({ title: "Could not load assessments", description: error.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [begin, toast]);

  useEffect(() => {
    if (!attempt) return;
    const timer = window.setInterval(() => {
      const current = remainingSeconds(attempt.expiresAt, Date.now() + serverOffset.current);
      const warning = warningForTransition(previousRemaining.current, current);
      previousRemaining.current = current;
      setRemaining(current);
      if (warning) toast({ title: `${Math.floor(warning / 60)} minute${warning === 60 ? "" : "s"} remaining`, description: "Answers are autosaved as you work." });
      if (current === 0) void finish("automatic");
    }, 1000);
    return () => window.clearInterval(timer);
  }, [attempt, finish, toast]);

  const updateAnswer = (questionId: string, value: unknown) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setSaveState("saving");
    const revision = (revisions.current[questionId] ?? 0) + 1;
    revisions.current[questionId] = revision;
    window.setTimeout(async () => {
      if (!attempt || revisions.current[questionId] !== revision) return;
      try {
        const response = await withRetry(() => autosaveAnswer(attempt.attemptId, questionId, { value }, revision));
        if (response.accepted === false) {
          await finish("automatic");
          return;
        }
        setSaveState("saved");
      } catch {
        setSaveState("offline");
      }
    }, 750);
  };

  if (result) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="text-success" /> Submission recorded</CardTitle></CardHeader>
        <CardContent className="space-y-2"><p>Status: {String(result.status ?? "submitted")}</p><p>Score: {String(result.percentage ?? "Pending scoring")}%</p></CardContent>
      </Card>
    );
  }

  if (!attempt) {
    return (
      <div className="space-y-6">
        <div><h2 className="text-3xl font-bold">Available assessments</h2><p className="text-muted-foreground">Each attempt has a strict server-enforced 30-minute limit.</p></div>
        {loading ? <p>Loading assessments…</p> : assessments.length === 0 ? <p>No assessments are available.</p> : (
          <div className="grid gap-4 md:grid-cols-2">
            {assessments.map((assessment) => (
              <Card key={assessment.id}>
                <CardHeader><div className="flex justify-between gap-3"><CardTitle>{assessment.name}</CardTitle><LanguageBadge language={assessment.language} /></div><CardDescription>{assessment.description}</CardDescription></CardHeader>
                <CardContent className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock className="h-4 w-4" />30 minutes</span><Button onClick={() => void begin(assessment.id)}>Start or resume</Button></CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="sticky top-20 z-20">
        <CardContent className="py-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold">{attempt.assessmentName}</h2><LanguageBadge language={attempt.language} /></div>
          <div className="flex items-center gap-4"><span className="text-sm flex items-center gap-1"><Save className="h-4 w-4" />{saveState}</span><span className={remaining <= 60 ? "font-mono text-xl text-destructive" : "font-mono text-xl"}><Clock className="inline h-5 w-5 mr-1" />{formatRemaining(remaining)}</span></div>
        </CardContent>
      </Card>

      {attempt.questions.map((question) => (
        <Card key={question.id}>
          <CardHeader><CardTitle>Question {question.position}</CardTitle><CardDescription>{question.type.replace("_", " ")}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <p>{question.prompt}</p>
            {question.type === "multiple_choice" ? (
              <RadioGroup value={String(answers[question.id] ?? "")} onValueChange={(value) => updateAnswer(question.id, value)}>
                {question.options.map((option, index) => <div key={index} className="flex gap-2"><RadioGroupItem value={String(index)} id={`${question.id}-${index}`} /><Label htmlFor={`${question.id}-${index}`}>{option}</Label></div>)}
              </RadioGroup>
            ) : question.type === "code" ? (
              <div className="space-y-2"><Textarea className="min-h-64 font-mono" value={String(answers[question.id] ?? "")} onChange={(event) => updateAnswer(question.id, event.target.value)} /><p className="text-sm text-muted-foreground flex gap-2"><AlertTriangle className="h-4 w-4" />Execution is disabled until an approved isolated Java/JavaScript runner is configured.</p></div>
            ) : <Textarea className="min-h-40" value={String(answers[question.id] ?? "")} onChange={(event) => updateAnswer(question.id, event.target.value)} />}
          </CardContent>
        </Card>
      ))}
      <Button size="lg" className="w-full" onClick={() => void finish("manual")}>Submit assessment</Button>
    </div>
  );
}
