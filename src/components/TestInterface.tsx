import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { allQuestions, getQuestionsByCategory, getMixedQuestions, type Question } from "@/data/allQuestions";
import { useTestSession } from "@/hooks/useTestSession";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StudentInfoDialog } from "@/components/StudentInfoDialog";

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface TestCaseResult {
  name: string;
  passed: boolean;
  message: string;
}

interface Answer {
  questionId: string;
  type: 'multiple-choice' | 'code' | 'text-input';
  value: string | { html: string; css: string } | { html: string; js: string };
  testResults?: TestCaseResult[];
}

interface TestInterfaceProps {
  onComplete: (results: any) => void;
  onBack: () => void;
  userName: string;
  userRole: 'student' | 'trainer';
  category?: 'javascript' | 'mock-interim';
  difficulty?: DifficultyLevel;
}

export const TestInterface = ({ onComplete, onBack, userName, userRole, category, difficulty = 'easy' }: TestInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [timeRemaining, setTimeRemaining] = useState(2400); // 40 minutes for coding questions
  const [testResults, setTestResults] = useState<Record<string, TestCaseResult[]>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showStudentDialog, setShowStudentDialog] = useState(userRole === 'student');
  const [studentInfo, setStudentInfo] = useState<{ studentId: string; name: string; cohortCode: string } | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [transformedQuestions, setTransformedQuestions] = useState<Question[]>([]);
  const [isTransforming, setIsTransforming] = useState(difficulty !== 'easy');
  
  const { createTestSession, saveTestResult, completeTestSession, loading } = useTestSession();
  const { toast } = useToast();

// Use mixed questions (5 total from all categories)
const baseQuestions = getMixedQuestions();
const questions = transformedQuestions.length > 0 ? transformedQuestions : baseQuestions;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Transform questions based on difficulty
  useEffect(() => {
    const transformQuestions = async () => {
      if (difficulty === 'easy') {
        console.log('Using easy mode - no transformation needed');
        setTransformedQuestions(baseQuestions);
        setIsTransforming(false);
        return;
      }

      console.log(`Starting transformation to ${difficulty} difficulty for ${baseQuestions.length} questions`);
      setIsTransforming(true);
      
      try {
        const transformed = await Promise.all(
          baseQuestions.map(async (q, index) => {
            try {
              console.log(`Question ${index + 1}: Transforming ${q.type} question`);

              const questionData: any = {
                scenario: q.scenario,
                type: q.type
              };

              // Add question-specific data
              if ('text' in q) questionData.text = q.text;
              if ('options' in q) questionData.options = q.options;
              if ('title' in q) questionData.title = (q as any).title;
              if ('instructions' in q) questionData.instructions = (q as any).instructions;

              const { data, error } = await supabase.functions.invoke('transform-question', {
                body: {
                  question: questionData,
                  difficulty,
                  type: q.type
                }
              });

              if (error) {
                console.error(`Question ${index + 1}: Transform error:`, error);
                return q; // Return original on error
              }

              if (!data?.transformedQuestion) {
                console.error(`Question ${index + 1}: No transformed question in response`);
                return q;
              }

              console.log(`Question ${index + 1}: Successfully transformed`, {
                originalScenario: q.scenario?.substring(0, 50),
                newScenario: data.transformedQuestion.scenario?.substring(0, 50),
                hasNewQuestion: !!data.transformedQuestion.question
              });

              const result: any = { ...q };
              
              // Update based on question type
              if (q.type === 'code') {
                if (data.transformedQuestion.scenario) {
                  result.scenario = data.transformedQuestion.scenario;
                }
                if (data.transformedQuestion.instructions) {
                  (result as any).instructions = data.transformedQuestion.instructions;
                }
                if (data.transformedQuestion.title) {
                  (result as any).title = data.transformedQuestion.title;
                }
              } else {
                if (data.transformedQuestion.question && 'text' in result) {
                  result.text = data.transformedQuestion.question;
                }
                if (data.transformedQuestion.scenario) {
                  result.scenario = data.transformedQuestion.scenario;
                }
                if (data.transformedQuestion.options && 'options' in result) {
                  result.options = data.transformedQuestion.options;
                }
              }

              return result;
            } catch (err) {
              console.error(`Question ${index + 1}: Error transforming:`, err);
              return q; // Return original on error
            }
          })
        );

        console.log('All questions transformed successfully');
        setTransformedQuestions(transformed);
      } catch (error) {
        console.error('Failed to transform questions:', error);
        toast({
          title: "Notice",
          description: "Using original questions due to transformation error",
          variant: "default"
        });
        setTransformedQuestions(baseQuestions);
      } finally {
        setIsTransforming(false);
      }
    };

    if (testStarted) {
      transformQuestions();
    }
  }, [difficulty, testStarted]);

  const handleStudentInfoSubmit = async (studentId: string, name: string, cohortCode: string) => {
    setStudentInfo({ studentId, name, cohortCode });
    setShowStudentDialog(false);
    
    // Create test session with student info
    const newSessionId = await createTestSession(name, userRole, studentId, cohortCode);
    if (newSessionId) {
      setSessionId(newSessionId);
      setTestStarted(true);
    } else {
      toast({
        title: "Error",
        description: "Failed to initialize test session",
        variant: "destructive"
      });
    }
  };

  // Initialize test session for trainers
  useEffect(() => {
    let mounted = true;
    
    const initializeSession = async () => {
      if (userRole === 'trainer') {
        const newSessionId = await createTestSession(userName, userRole);
        if (mounted && newSessionId) {
          setSessionId(newSessionId);
          setTestStarted(true);
        } else if (mounted && !newSessionId) {
          toast({
            title: "Error",
            description: "Failed to initialize test session",
            variant: "destructive"
          });
        }
      }
    };

    if (!sessionId && userRole === 'trainer') {
      initializeSession();
    }

    return () => {
      mounted = false;
    };
  }, [userRole]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      finishTest();
    }
  }, [timeRemaining]);

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: {
        questionId,
        type: 'text-input',
        value: text
      }
    }));
  };

  const handleMultipleChoiceAnswer = (questionId: string, answerIndex: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: {
        questionId,
        type: 'multiple-choice',
        value: answerIndex
      }
    }));
  };

  const handleCodeAnswer = (questionId: string, html: string, css: string, js?: string) => {
    const question = questions.find(q => q.id === questionId);
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: {
        questionId,
        type: question?.type === 'code' ? 'code' : 'multiple-choice',
        value: question?.type === 'code' ? { html, js: js || '' } : { html, css }
      }
    }));
  };

  const runTests = async (question: Question) => {
    if (question.type !== 'code') return;
    
    const answer = answers[question.id];
    if (!answer || answer.type !== 'code') return;

    // Ensure testCases exist before trying to run them
    if (!('testCases' in question) || !question.testCases || question.testCases.length === 0) {
      toast({
        title: "No Tests Available",
        description: "This question doesn't have test cases defined.",
        variant: "destructive"
      });
      return;
    }

    const { html, js } = answer.value as { html: string; js: string };
    
    const results = await Promise.all(question.testCases.map(async testCase => {
      try {
        const passed = await testCase.test(js);
        return {
          name: testCase.name,
          passed,
          message: passed 
            ? '✓ Test passed successfully' 
            : `✗ Test failed: Expected behavior not found. Check your code logic and make sure all requirements are met.`
        };
      } catch (error) {
        return {
          name: testCase.name,
          passed: false,
          message: `✗ Error executing test: ${error instanceof Error ? error.message : 'Unknown error'}. Check your code for syntax errors.`
        };
      }
    }));

    setTestResults(prev => ({ ...prev, [question.id]: results }));
    
    // Update answer with test results
    setAnswers(prev => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        testResults: results
      }
    }));
    
    // Show toast with summary
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    toast({
      title: passedCount === totalCount ? "All Tests Passed! 🎉" : "Tests Completed",
      description: `${passedCount} of ${totalCount} tests passed`,
      variant: passedCount === totalCount ? "default" : "destructive"
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Check for untested code questions before finishing
      const untestedCodeQuestions = questions.filter(q => 
        q.type === 'code' && 
        answers[q.id] && 
        !testResults[q.id]
      );
      
      if (untestedCodeQuestions.length > 0) {
        toast({
          title: "Untested Code Detected",
          description: `You have ${untestedCodeQuestions.length} code question(s) without test results. Consider running tests before submitting.`,
          variant: "default"
        });
      }
      
      finishTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishTest = async () => {
    const canPersist = !!sessionId;
    if (!sessionId) {
      toast({
        title: "Notice",
        description: "Results will be shown but not saved (not signed in)",
        variant: "default"
      });
    }

    // Save all answers to database
    for (const q of questions) {
      const answer = answers[q.id];
      let isCorrect = false;
      let selectedAnswer = 'No answer';
      let correctAnswer = '';
      let score = 0;
      let aiEvaluation = null;

      if (answer) {
        if (q.type === 'multiple-choice') {
          isCorrect = answer.value === q.correctAnswer;
          selectedAnswer = answer.value as string;
          correctAnswer = q.correctAnswer || '';
          score = isCorrect ? 100 : 0;
        } else if (q.type === 'text-input') {
          selectedAnswer = answer.value as string;
          correctAnswer = 'Detailed answer expected';
          
          // Use AI evaluation for mock interim questions
          if (q.topic.toLowerCase().includes('mock') && selectedAnswer.trim().length > 10) {
            try {
              const { data, error } = await supabase.functions.invoke('evaluate-answer', {
                body: {
                  question: q.text,
                  answer: selectedAnswer,
                  expectedKeywords: (q as any).expectedKeywords
                }
              });

              if (!error && data) {
                aiEvaluation = data;
                score = data.score || 0;
                isCorrect = score >= 70; // Consider 70+ as correct
              } else {
                // Fallback to basic evaluation
                isCorrect = selectedAnswer.trim().length > 10;
                score = isCorrect ? 50 : 0;
              }
            } catch (error) {
              console.error('AI evaluation failed:', error);
              // Fallback to basic evaluation
              isCorrect = selectedAnswer.trim().length > 10;
              score = isCorrect ? 50 : 0;
            }
          } else {
            // Basic evaluation for non-functional testing or short answers
            isCorrect = selectedAnswer.trim().length > 10;
            score = isCorrect ? 50 : 0;
          }
        } else {
          // For code questions, check if all test cases passed
          const testResults = answer.testResults || [];
          // Only mark as correct if tests were run and all passed
          // If tests weren't run but code was written, mark as incomplete (score 50)
          if (testResults.length > 0) {
            isCorrect = testResults.every(r => r.passed);
            score = isCorrect ? 100 : 0;
          } else {
            // Code was written but tests weren't run
            // Check if code is not empty
            const codeValue = answer.value as { html: string; js: string };
            if (codeValue && codeValue.js && codeValue.js.trim().length > 0) {
              // Give partial credit for submitting code without testing
              score = 50;
              isCorrect = false; // Mark as incomplete, not correct
            } else {
              // No code written at all
              score = 0;
              isCorrect = false;
            }
          }
          selectedAnswer = JSON.stringify(answer.value);
          correctAnswer = 'All test cases must pass';
        }
      } else {
        if (q.type === 'multiple-choice') {
          correctAnswer = q.correctAnswer || '';
        } else if (q.type === 'text-input') {
          correctAnswer = 'Detailed answer expected';
        } else {
          correctAnswer = 'All test cases must pass';
        }
      }

      // Save using the useTestSession hook method (only if signed in)
      if (canPersist) {
        try {
          await saveTestResult(
            sessionId!,
            q.id.toString(),
            q.type === 'multiple-choice' || q.type === 'text-input' ? q.text : (q as any).title,
            q.topic,
            q.difficulty,
            selectedAnswer,
            correctAnswer,
            isCorrect
          );
        } catch (error) {
          console.error('Failed to save test result:', error);
          toast({
            title: "Error",
            description: "Failed to save some answers. Please try again.",
            variant: "destructive"
          });
        }
      }
    }

    // Complete the session
    if (canPersist) {
      await completeTestSession(sessionId!);
    }

    // Calculate results for UI
    const results = questions.map(q => {
      const answer = answers[q.id];
      if (!answer) return { questionId: q.id, correct: false, topic: q.topic, difficulty: q.difficulty };

      if (q.type === 'multiple-choice') {
        return {
          questionId: q.id,
          correct: answer.value === q.correctAnswer,
          topic: q.topic,
          difficulty: q.difficulty
        };
      } else if (q.type === 'text-input') {
        return {
          questionId: q.id,
          correct: (answer.value as string).trim().length > 10,
          topic: q.topic,
          difficulty: q.difficulty
        };
      } else {
        const testResults = answer.testResults || [];
        const allPassed = testResults.length > 0 && testResults.every(r => r.passed);
        return {
          questionId: q.id,
          correct: allPassed,
          topic: q.topic,
          difficulty: q.difficulty,
          testResults
        };
      }
    });

    console.log('TestInterface: Finishing test, results:', results);
    onComplete({ results, sessionId, userName });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];
  const hasAnswer = currentAnswer !== undefined;
  
  // Show student info dialog first for students
  if (!testStarted) {
    return (
      <StudentInfoDialog
        open={showStudentDialog}
        onSubmit={handleStudentInfoSubmit}
        onCancel={onBack}
      />
    );
  }

  // Show loading while transforming questions
  if (isTransforming) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Preparing Your Questions...</h3>
          <p className="text-muted-foreground">
            {difficulty === 'medium' 
              ? 'Generating engaging scenario-based questions...' 
              : 'Creating advanced challenge questions...'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <Badge 
              variant={difficulty === 'easy' ? 'secondary' : difficulty === 'medium' ? 'default' : 'destructive'}
              className="text-sm"
            >
              {difficulty.toUpperCase()} Mode
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
            </div>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {question.type === 'code' ? (question as any).title : `Question ${currentQuestion + 1}`}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant={question.difficulty === 'Hard' ? 'destructive' : question.difficulty === 'Medium' ? 'secondary' : 'default'}>
                  {question.difficulty}
                </Badge>
                <Badge variant="outline">{question.topic}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scenario */}
            <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                Scenario
              </h4>
              <p className="text-foreground leading-relaxed">{question.scenario}</p>
            </div>

            {/* Question Content */}
            {question.type === 'text-input' ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
                <Textarea
                  placeholder="Please provide a detailed answer explaining your approach, strategies, and considerations..."
                  value={(currentAnswer?.value as string) || ''}
                  onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                  className="min-h-[200px] resize-y"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Minimum 10 characters required. Provide a comprehensive answer with specific details and examples.
                </p>
              </div>
            ) : question.type === 'multiple-choice' ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
                
                <RadioGroup 
                  value={currentAnswer?.value?.toString()} 
                  onValueChange={(value) => handleMultipleChoiceAnswer(question.id, value)}
                >
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                      <Label htmlFor={`option-${index}`} className="text-sm leading-relaxed cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Instructions</h3>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => runTests(question)}
                    disabled={!currentAnswer}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Tests
                  </Button>
                </div>
                <div className="mb-6 p-4 bg-accent/10 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{(question as any).instructions}</pre>
                </div>
                
                <CodeEditor
                  key={question.id}
                  initialHtml={(question as any).starterCode?.html || ''}
                  initialCss={''}
                  initialJs={(question as any).starterCode?.js || ''}
                  onCodeChange={(html, css, js) => handleCodeAnswer(question.id, html, css, js)}
                  testResults={testResults[question.id] || []}
                  showJsTab={true}
                  jsOnly={true}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion 
                    ? 'bg-primary' 
                    : answers[questions[index].id] !== undefined 
                      ? 'bg-success' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button 
            onClick={handleNext}
            disabled={currentQuestion !== questions.length - 1 && !hasAnswer}
            variant={currentQuestion === questions.length - 1 ? "default" : "default"}
          >
            {currentQuestion === questions.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish Test
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};