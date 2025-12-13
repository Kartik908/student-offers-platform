import { useState } from "react";
import { useSubmissions, useUpdateSubmissionStatus, useDeleteSubmission } from "@/hooks/useSubmissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ExternalLink, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const SubmissionsTable = () => {
  const { data: submissions, isLoading, error } = useSubmissions();
  const updateStatus = useUpdateSubmissionStatus();
  const deleteSubmission = useDeleteSubmission();
  const [adminNotes, setAdminNotes] = useState("");

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await updateStatus.mutateAsync({ id, status, adminNotes });
      toast.success(`Submission ${status} successfully`);
      setAdminNotes("");
    } catch {
      toast.error(`Failed to ${status} submission`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      try {
        await deleteSubmission.mutateAsync(id);
        toast.success('Submission deleted successfully');
      } catch {
        toast.error('Failed to delete submission');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-500"><CheckCircle className="w-3 h-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) return <div className="p-4">Loading submissions...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading submissions: {error.message}</div>;
  if (!submissions?.length) return <div className="p-4">No submissions found.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Offer Submissions</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(submission.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <a
                  href={submission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 max-w-xs truncate"
                >
                  <span className="truncate">{submission.url}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{submission.category}</Badge>
              </TableCell>
              <TableCell>
                {getStatusBadge(submission.status)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {submission.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleStatusUpdate(submission.id, 'approved')}
                        disabled={updateStatus.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                        disabled={updateStatus.isPending}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {submission.status !== 'pending' && (
                    <span className="text-sm text-muted-foreground mr-2">
                      {submission.reviewed_at && `Reviewed ${new Date(submission.reviewed_at).toLocaleDateString()}`}
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(submission.id)}
                    disabled={deleteSubmission.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};