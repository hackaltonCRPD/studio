
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilePlus, Search, CheckCircle, User, Shield } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DocuFind User Guide</CardTitle>
          <CardDescription>
            Your step-by-step guide to reporting, finding, and claiming lost documents.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <FilePlus className="h-6 w-6" />
                </div>
                <CardTitle>1. Reporting a Lost or Found Document</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If you've lost a document or found one belonging to someone else, the first step is to create a report. This adds the item to our database, making it searchable for others.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Navigate to the <span className="font-semibold text-primary">Report Document</span> page from the sidebar.</li>
            <li>Fill in the form with as much detail as possible, including the document type, a clear description, the last known location, and the date.</li>
            <li>If you have a photo or scan of the document (especially for found items), upload it. This significantly increases the chances of a successful match.</li>
            <li>Once submitted, your report will be live on the platform.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
             <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <Search className="h-6 w-6" />
                </div>
                <CardTitle>2. Searching for a Document</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Use our powerful search to look for a document you have lost.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Go to the <span className="font-semibold text-primary">Search Documents</span> page.</li>
            <li>Use the filters at the top to narrow down your search by document type, location, or status (e.g., select 'found' to see items that have been turned in).</li>
            <li>Browse the results. Click on any item to view more details about it.</li>
          </ul>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
             <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle>3. Claiming a Found Document</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            If you find your lost item in the search results, the next step is to start the claim process.
          </p>
           <ul className="list-disc pl-6 space-y-2">
            <li>On the document details page, you will find a button to initiate a claim.</li>
            <li>An RC (Resident Committee) Staff member will be notified. They will review the details and may contact you to verify your identity.</li>
             <li>Make sure your contact information on your <span className="font-semibold text-primary">Profile</span> page is up to date so our staff can reach you.</li>
            <li>Once your identity is confirmed, the RC Staff will arrange a time for you to collect your document.</li>
          </ul>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
             <div className="flex items-center gap-3">
                <div className="bg-destructive/10 text-destructive p-3 rounded-full">
                    <Shield className="h-6 w-6" />
                </div>
                <CardTitle>Important Notes on Security & Privacy</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <div className="flex items-start gap-4">
                <User className="h-5 w-5 mt-1"/>
                <div>
                    <h4 className="font-semibold text-foreground">Your Information</h4>
                    <p>Your personal contact information (email, phone number) is not visible to the general public. Only authorized personnel like RC Staff, Police, and Admins can view it for verification purposes.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 mt-1"/>
                 <div>
                    <h4 className="font-semibold text-foreground">Credibility Score</h4>
                    <p>DocuFind uses a credibility score to maintain the integrity of the platform. Reporting false information or misusing the system can negatively impact your score and may lead to account suspension.</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
