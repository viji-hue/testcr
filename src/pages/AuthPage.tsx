import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role') === 'trainer' ? 'trainer' : 'student';
  const { toast } = useToast();
  const { signIn, signUp, loading: authLoading } = useAuth();
  
  // Login state
  const [loginCohort, setLoginCohort] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Signup state
  const [signupCohort, setSignupCohort] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<'student' | 'trainer'>('student');
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginCohort.trim() || !loginName.trim() || !loginPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoginLoading(true);
    const result = await signIn(loginCohort.trim(), loginName.trim(), loginPassword.trim());
    setLoginLoading(false);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      navigate(requestedRole === 'trainer' ? '/trainer' : '/student');
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupCohort.trim() || !signupName.trim() || !signupPassword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setSignupLoading(true);
    const result = await signUp(
      signupCohort.trim(), 
      signupName.trim(), 
      signupPassword.trim(), 
      signupRole
    );
    setSignupLoading(false);

    if (result.success) {
      toast({
        title: "Account Created!",
        description: "Successfully signed up. You can now log in.",
      });
      // Switch to login tab
      document.querySelector('[value="login"]')?.dispatchEvent(new Event('click', { bubbles: true }));
    } else {
      toast({
        title: "Signup Failed",
        description: result.error || "Could not create account",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-white" />
            <h1 className="text-3xl font-bold text-white">Testing Platform</h1>
          </div>
          <p className="text-white/80">Master knowledge with smart assessments</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Welcome Back</CardTitle>
                <CardDescription className="text-white/70">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-cohort" className="text-white">Cohort Code</Label>
                    <Input
                      id="login-cohort"
                      value={loginCohort}
                      onChange={(e) => setLoginCohort(e.target.value)}
                      placeholder="e.g., CS2024"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={loginLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-name" className="text-white">Your Name</Label>
                    <Input
                      id="login-name"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={loginLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={loginLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-white text-primary hover:bg-white/90"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-white/70">
                  Sign up to start your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-cohort" className="text-white">Cohort Code</Label>
                    <Input
                      id="signup-cohort"
                      value={signupCohort}
                      onChange={(e) => setSignupCohort(e.target.value)}
                      placeholder="e.g., CS2024"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={signupLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Your Name</Label>
                    <Input
                      id="signup-name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={signupLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      disabled={signupLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">I am a:</Label>
                    <RadioGroup value="student" disabled>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" className="border-white text-white" />
                        <Label htmlFor="student" className="text-white font-normal cursor-pointer">
                          Student
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-white/70">Trainer accounts are created by an administrator.</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-white text-primary hover:bg-white/90"
                    disabled={signupLoading}
                  >
                    {signupLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
