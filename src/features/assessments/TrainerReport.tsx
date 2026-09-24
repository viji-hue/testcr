import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getAssessmentReport, recordReportExport } from "./api";
import type { AssessmentLanguage, AssessmentReport } from "./types";

const csvCell = (value: unknown) => {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function TrainerReport({ assessmentId, onBack }: { assessmentId: string; onBack: () => void }) {
  const { toast } = useToast();
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [language, setLanguage] = useState<"all" | AssessmentLanguage>("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"score" | "submitted_at">("score");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    getAssessmentReport(assessmentId, { language: language === "all" ? undefined : language, status: status === "all" ? undefined : status, search, sort, page })
      .then(setReport)
      .catch((error) => toast({ title: "Could not load report", description: error.message, variant: "destructive" }));
  }, [assessmentId, language, page, search, sort, status, toast]);

  useEffect(load, [load]);

  const exportCsv = async () => {
    if (!report) return;
    const headers = ["Candidate ID", "Candidate name", "Language", "Started", "Submitted", "Time used seconds", "Submission mode", "Attempted", "Not attempted", "Correct", "Incorrect", "Tests passed", "Tests failed", "Execution failure", "Score", "Percentage", "Result", "Status"];
    const rows = report.candidates.map((row) => [row.candidateId, row.candidateName, row.language, row.startedAt, row.submittedAt, row.timeUsedSeconds, row.submissionMode, row.questionsAttempted, row.questionsNotAttempted, row.correctAnswers, row.incorrectAnswers, row.testCasesPassed, row.testCasesFailed, row.executionFailure, row.totalScore, row.percentage, row.result, row.status]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `assessment-${assessmentId}-report.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    try { await recordReportExport(assessmentId, "csv"); } catch { toast({ title: "Export created", description: "The audit event could not be recorded." }); }
  };

  const summary = report?.summary ?? {};
  const summaryFields = [
    ["Started", "numberStarted"], ["Submitted", "numberSubmitted"], ["Auto-submitted", "numberAutoSubmitted"],
    ["Not started", "numberNotStarted"], ["Average score", "averageScore"], ["Highest score", "highestScore"],
    ["Lowest score", "lowestScore"], ["Pass count", "passCount"], ["Fail count", "failCount"], ["Pass %", "passPercentage"],
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap justify-between gap-3"><Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Assessments</Button><Button variant="outline" onClick={() => void exportCsv()} disabled={!report}><Download className="h-4 w-4 mr-2" />Export CSV</Button></div>
      <div><h2 className="text-3xl font-bold">{String(summary.assessmentName ?? "Assessment report")}</h2><p className="text-muted-foreground">{String(summary.language ?? "")} · 30 minutes · scheduled {summary.scheduledDate ? new Date(String(summary.scheduledDate)).toLocaleString() : "on demand"}</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{summaryFields.map(([label, key]) => <Card key={key}><CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{String(summary[key] ?? 0)}{label.includes("score") || label.includes("%") ? "%" : ""}</CardContent></Card>)}</div>
      <Card><CardHeader><CardTitle>Question success rate</CardTitle></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{report?.questionSuccessRates.map((item) => <div key={item.questionId} className="border rounded p-3"><strong>Question {item.position}</strong><div>{item.successRate}% successful</div></div>)}</CardContent></Card>
      <div className="flex flex-wrap gap-3">
        <Input className="max-w-xs" placeholder="Search candidate" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        <Select value={language} onValueChange={(value) => { setLanguage(value as typeof language); setPage(1); }}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All languages</SelectItem><SelectItem value="java">Java</SelectItem><SelectItem value="javascript">JavaScript</SelectItem></SelectContent></Select>
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="expired">Auto-submitted</SelectItem></SelectContent></Select>
        <Select value={sort} onValueChange={(value) => { setSort(value as typeof sort); setPage(1); }}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="score">Sort by score</SelectItem><SelectItem value="submitted_at">Sort by submission time</SelectItem></SelectContent></Select>
      </div>
      <Card><CardContent className="pt-6 overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Candidate</TableHead><TableHead>Type</TableHead><TableHead>Started</TableHead><TableHead>Submitted</TableHead><TableHead>Mode</TableHead><TableHead>Attempted</TableHead><TableHead>Correct</TableHead><TableHead>Score</TableHead><TableHead>Result</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{report?.candidates.map((row) => <TableRow key={row.candidateId}><TableCell><div>{row.candidateName || "—"}</div><div className="text-xs text-muted-foreground">{row.candidateId}</div></TableCell><TableCell>{row.language}</TableCell><TableCell>{new Date(row.startedAt).toLocaleString()}</TableCell><TableCell>{row.submittedAt ? new Date(row.submittedAt).toLocaleString() : "—"}</TableCell><TableCell>{row.submissionMode || "—"}</TableCell><TableCell>{row.questionsAttempted}/{row.questionsAttempted + row.questionsNotAttempted}</TableCell><TableCell>{row.correctAnswers}</TableCell><TableCell>{row.percentage}%</TableCell><TableCell>{row.result}</TableCell><TableCell>{row.status}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
      <div className="flex justify-between"><Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page}</span><Button variant="outline" disabled={!report || page * 25 >= report.totalCandidates} onClick={() => setPage((value) => value + 1)}>Next</Button></div>
    </div>
  );
}
