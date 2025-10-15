import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Sign up page coming soon...
          </p>
          <div className="mt-6 text-center">
            <Link to="/login">
              <Button variant="outline">Back to Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
