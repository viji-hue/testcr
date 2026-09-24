import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Save, X, FileText, Code, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createAssessment } from "@/features/assessments/api";
import type { AssessmentLanguage } from "@/features/assessments/types";

interface Question {
  id: string;
  type: 'multiple-choice' | 'code' | 'js-code';
  title?: string;
  text?: string;
  scenario: string;
  difficulty: 'intermediate' | 'advanced';
  topic: string;
  options?: string[];
  correctAnswer?: number;
  instructions?: string;
  starterCode?: {
    html?: string;
    css?: string;
    js?: string;
  };
}

interface TestCreatorProps {
  onBack: () => void;
  onSaved?: (assessmentId: string) => void;
}

export const TestCreator = ({ onBack, onSaved }: TestCreatorProps) => {
  const { toast } = useToast();
  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [language, setLanguage] = useState<AssessmentLanguage>("javascript");
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: 'multiple-choice',
    scenario: "",
    difficulty: 'intermediate',
    topic: "",
    options: ["", "", "", ""],
    correctAnswer: 0
  });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const generateQuestionId = () => `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      id: "",
      type: 'multiple-choice',
      scenario: "",
      difficulty: 'intermediate',
      topic: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    });
    setEditingQuestionId(null);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.scenario || !currentQuestion.topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in the scenario and topic fields.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion.type === 'multiple-choice') {
      if (!currentQuestion.text || currentQuestion.options?.some(opt => !opt.trim())) {
        toast({
          title: "Incomplete Question",
          description: "Please fill in the question text and all options.",
          variant: "destructive"
        });
        return;
      }
    }

    if ((currentQuestion.type === 'code' || currentQuestion.type === 'js-code') && !currentQuestion.instructions) {
      toast({
        title: "Missing Instructions",
        description: "Please provide coding instructions for this question.",
        variant: "destructive"
      });
      return;
    }

    const questionToAdd = {
      ...currentQuestion,
      id: editingQuestionId || generateQuestionId()
    };

    if (editingQuestionId) {
      setQuestions(prev => prev.map(q => q.id === editingQuestionId ? questionToAdd : q));
      toast({
        title: "Question Updated",
        description: "The question has been updated successfully."
      });
    } else {
      setQuestions(prev => [...prev, questionToAdd]);
      toast({
        title: "Question Added",
        description: "The question has been added to your test."
      });
    }

    resetCurrentQuestion();
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion(question);
    setEditingQuestionId(question.id);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    if (editingQuestionId === questionId) {
      resetCurrentQuestion();
    }
    toast({
      title: "Question Deleted",
      description: "The question has been removed from your test."
    });
  };

  const handleSaveTest = async () => {
    if (!testName || questions.length === 0) {
      toast({
        title: "Cannot Save Test",
        description: "Please provide a test name and add at least one question.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const assessmentId = await createAssessment({
        name: testName,
        description: testDescription,
        language,
        questions: questions.map((question) => ({
          type: question.type === "multiple-choice" ? "multiple_choice" : "code",
          prompt: [question.scenario, question.text || question.instructions].filter(Boolean).join("\n\n"),
          options: question.options,
          publicConfig: { title: question.title, starterCode: question.starterCode, topic: question.topic, difficulty: question.difficulty },
          privateConfig: question.type === "multiple-choice" ? { correctAnswer: String(question.correctAnswer ?? 0) } : {},
        })),
      });
      toast({ title: "Assessment saved", description: `“${testName}” was saved as a draft with a fixed 30-minute duration.` });
      setTestName("");
      setTestDescription("");
      setQuestions([]);
      resetCurrentQuestion();
      onSaved?.(assessmentId);
    } catch (error) {
      toast({ title: "Could not save assessment", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateCurrentQuestionOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt) || []
    }));
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return <FileText className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      case 'js-code': return <Brain className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'code': return 'HTML/CSS Code';
      case 'js-code': return 'JavaScript Code';
      default: return 'Question';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Test</h1>
              <p className="text-muted-foreground">Design custom assessments for your students</p>
            </div>
          </div>
          <Button onClick={() => void handleSaveTest()} disabled={!testName || questions.length === 0 || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving…" : "Save Assessment"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Configuration */}
          <div className="lg:col-span-1">
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle>Test Configuration</CardTitle>
                <CardDescription>Basic test settings and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testName">Test Name *</Label>
                  <Input
                    id="testName"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="e.g., JavaScript Fundamentals Quiz"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testDescription">Description</Label>
                  <Textarea
                    id="testDescription"
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    placeholder="Brief description of what this test covers..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assessmentLanguage">Assessment type *</Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as AssessmentLanguage)}>
                    <SelectTrigger id="assessmentLanguage"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="java">Java</SelectItem><SelectItem value="javascript">JavaScript</SelectItem></SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testDuration">Duration</Label>
                  <Input id="testDuration" value="30 minutes (server enforced)" readOnly />
                </div>
              </CardContent>
            </Card>

            {/* Questions Summary */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Questions ({questions.length})
                  <Badge variant="outline">{questions.length} total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getQuestionTypeIcon(question.type)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {question.type === 'multiple-choice' ? question.text : question.title || `${getQuestionTypeLabel(question.type)} Question`}
                          </p>
                          <p className="text-xs text-muted-foreground">{question.topic}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      No questions added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Builder */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>
                  {editingQuestionId ? "Edit Question" : "Add New Question"}
                </CardTitle>
                <CardDescription>
                  Create scenario-based questions for your assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value as any }))}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="multiple-choice">Multiple Choice</TabsTrigger>
                    <TabsTrigger value="code">HTML/CSS Code</TabsTrigger>
                    <TabsTrigger value="js-code">{language === "java" ? "Java" : "JavaScript"} Code</TabsTrigger>
                  </TabsList>

                  {/* Common Fields */}
                  <div className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic *</Label>
                        <Input
                          id="topic"
                          value={currentQuestion.topic}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, topic: e.target.value }))}
                          placeholder="e.g., DOM Manipulation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty *</Label>
                        <Select value={currentQuestion.difficulty} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, difficulty: value as any }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scenario">Scenario *</Label>
                      <Textarea
                        id="scenario"
                        value={currentQuestion.scenario}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, scenario: e.target.value }))}
                        placeholder="Describe the real-world context for this question..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Multiple Choice */}
                  <TabsContent value="multiple-choice" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="questionText">Question Text *</Label>
                      <Textarea
                        id="questionText"
                        value={currentQuestion.text || ""}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="What is the question you want to ask?"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Answer Options *</Label>
                      <RadioGroup value={currentQuestion.correctAnswer?.toString()} onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(value) }))}>
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Input
                              value={option}
                              onChange={(e) => updateCurrentQuestionOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1"
                            />
                            <Label htmlFor={`option-${index}`} className="text-xs text-muted-foreground">
                              {currentQuestion.correctAnswer === index ? "Correct" : ""}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  {/* HTML/CSS Code */}
                  <TabsContent value="code" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="codeTitle">Question Title</Label>
                      <Input
                        id="codeTitle"
                        value={currentQuestion.title || ""}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Create a Responsive Navigation Bar"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions *</Label>
                      <Textarea
                        id="instructions"
                        value={currentQuestion.instructions || ""}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Provide detailed coding instructions..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="starterHtml">Starter HTML</Label>
                        <Textarea
                          id="starterHtml"
                          value={currentQuestion.starterCode?.html || ""}
                          onChange={(e) => setCurrentQuestion(prev => ({ 
                            ...prev, 
                            starterCode: { ...prev.starterCode, html: e.target.value }
                          }))}
                          placeholder="<div><!-- starter code --></div>"
                          rows={3}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="starterCss">Starter CSS</Label>
                        <Textarea
                          id="starterCss"
                          value={currentQuestion.starterCode?.css || ""}
                          onChange={(e) => setCurrentQuestion(prev => ({ 
                            ...prev, 
                            starterCode: { ...prev.starterCode, css: e.target.value }
                          }))}
                          placeholder="/* Add your CSS here */"
                          rows={3}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* JavaScript Code */}
                  <TabsContent value="js-code" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jsTitle">Question Title</Label>
                      <Input
                        id="jsTitle"
                        value={currentQuestion.title || ""}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Dynamic List Management with DOM"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jsInstructions">Instructions *</Label>
                      <Textarea
                        id="jsInstructions"
                        value={currentQuestion.instructions || ""}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Provide detailed coding instructions..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="starterJsHtml">Starter HTML</Label>
                        <Textarea
                          id="starterJsHtml"
                          value={currentQuestion.starterCode?.html || ""}
                          onChange={(e) => setCurrentQuestion(prev => ({ 
                            ...prev, 
                            starterCode: { ...prev.starterCode, html: e.target.value }
                          }))}
                          placeholder="<div><!-- HTML structure --></div>"
                          rows={3}
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="starterJs">Starter {language === "java" ? "Java" : "JavaScript"}</Label>
                        <Textarea
                          id="starterJs"
                          value={currentQuestion.starterCode?.js || ""}
                          onChange={(e) => setCurrentQuestion(prev => ({ 
                            ...prev, 
                            starterCode: { ...prev.starterCode, js: e.target.value }
                          }))}
                          placeholder="// Add your JavaScript code here"
                          rows={3}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                  {editingQuestionId && (
                    <Button variant="outline" onClick={resetCurrentQuestion}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleAddQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    {editingQuestionId ? "Update Question" : "Add Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
