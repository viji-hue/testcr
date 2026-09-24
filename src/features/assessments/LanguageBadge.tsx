import { Badge } from "@/components/ui/badge";
import type { AssessmentLanguage } from "./types";

export function LanguageBadge({ language }: { language: AssessmentLanguage }) {
  return <Badge variant={language === "java" ? "secondary" : "default"}>{language === "java" ? "Java" : "JavaScript"}</Badge>;
}
