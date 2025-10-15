import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PasswordResetPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>PasswordResetPage</CardTitle>
            <CardDescription>
              This page is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              This feature is coming soon...
            </p>
            <div className="text-center">
              <Link to="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
