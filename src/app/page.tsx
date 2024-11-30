"use client";
import { UserButton } from "@/features/auth/components/user_button";
import { usecreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
export default function Home() {
  const router = useRouter();
  const [open, setOpen] = usecreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    } else {
      console.log("Open creation model");
    }
  }, [workspaceId, isLoading, open, setOpen, router]);
  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}
