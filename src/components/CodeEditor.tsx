import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Play, Code, Terminal } from "lucide-react";
import { executeCandidateCode } from "@/features/assessments/execution";

interface CodeEditorProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  onCodeChange: (html: string, css: string, js?: string) => void;
  testResults?: TestCaseResult[];
  showJsTab?: boolean;
  jsOnly?: boolean;
}

interface TestCaseResult {
  name: string;
  passed: boolean;
  message: string;
}

export const CodeEditor = ({ 
  initialHtml = "", 
  initialCss = "", 
  initialJs = "",
  onCodeChange,
  testResults = [],
  showJsTab = false,
  jsOnly = false
}: CodeEditorProps) => {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [showPreview, setShowPreview] = useState(!jsOnly);
  const [output, setOutput] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(jsOnly);

  // Reset code when initial values change (when question changes)
  useEffect(() => {
    setHtml(initialHtml);
    setCss(initialCss);
    setJs(initialJs);
  }, [initialHtml, initialCss, initialJs]);

  const handleHtmlChange = (value: string) => {
    setHtml(value);
    onCodeChange(value, css, js);
  };

  const handleCssChange = (value: string) => {
    setCss(value);
    onCodeChange(html, value, js);
  };

  const handleJsChange = (value: string) => {
    setJs(value);
    onCodeChange(html, css, value);
  };

  const executeCode = async () => {
    setOutput([]);
    const result = await executeCandidateCode({ language: "javascript", source: js, testBundleId: "legacy-preview" });
    setOutput([result.stdout, result.stderr].filter(Boolean));
  };

  const generatePreviewCode = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .error { color: red; font-size: 12px; display: block; margin-top: 4px; }
          .form-group { margin-bottom: 16px; }
          label { display: block; margin-bottom: 4px; font-weight: bold; }
          input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          button:disabled { background: #ccc; cursor: not-allowed; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          Code Editor
        </h3>
        <div className="flex gap-2">
          {jsOnly && (
            <Button
              variant="default"
              size="sm"
              onClick={() => void executeCode()}
              className="bg-gradient-hero"
            >
              <Play className="h-4 w-4 mr-2" />
              Execute Code
            </Button>
          )}
          {!jsOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
        {/* Code Editors */}
        <div className="space-y-4">
          {jsOnly ? (
            // JavaScript only editor
            <div className="h-full">
              <textarea
                value={js}
                onChange={(e) => handleJsChange(e.target.value)}
                className="w-full h-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-muted/30"
                placeholder="Write your JavaScript code here..."
                spellCheck={false}
              />
            </div>
          ) : (
            // HTML/CSS/JS tabs
            <Tabs defaultValue="html" className="h-full flex flex-col">
              <TabsList className={`grid w-full ${showJsTab ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                {showJsTab && <TabsTrigger value="js">JavaScript</TabsTrigger>}
              </TabsList>
            
            <TabsContent value="html" className="flex-1">
              <textarea
                value={html}
                onChange={(e) => handleHtmlChange(e.target.value)}
                className="w-full h-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your HTML code here..."
                spellCheck={false}
              />
            </TabsContent>
            
            <TabsContent value="css" className="flex-1">
              <textarea
                value={css}
                onChange={(e) => handleCssChange(e.target.value)}
                className="w-full h-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your CSS code here..."
                spellCheck={false}
              />
            </TabsContent>
            
            {showJsTab && (
              <TabsContent value="js" className="flex-1">
                <textarea
                  value={js}
                  onChange={(e) => handleJsChange(e.target.value)}
                  className="w-full h-full p-3 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your JavaScript code here..."
                  spellCheck={false}
                />
              </TabsContent>
            )}
            </Tabs>
          )}
        </div>

        {/* Output / Preview */}
        {jsOnly ? (
          showOutput && (
            <Card className="border rounded-md overflow-hidden">
              <CardHeader className="bg-muted px-3 py-2 border-b">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 font-mono text-sm bg-muted/30 h-full overflow-auto">
                {output.length > 0 ? (
                  output.map((line, index) => (
                    <div key={index} className={line.startsWith('Error:') ? 'text-destructive' : 'text-foreground'}>
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic">
                    Click "Execute Code" to run your code and see the output here.
                  </div>
                )}
              </CardContent>
            </Card>
          )
        ) : (
          showPreview && (
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-b">
                Preview
              </div>
              <iframe
                srcDoc={generatePreviewCode()}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title="Code Preview"
              />
            </div>
          )
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Play className="h-4 w-4" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    result.passed ? "bg-success/10" : "bg-destructive/10"
                  }`}
                >
                  {result.passed ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-muted-foreground">{result.message}</div>
                  </div>
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? "PASS" : "FAIL"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
