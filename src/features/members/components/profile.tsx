import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import {
  AlertTriangle,
  ChevronDown,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { UseConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();
  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() || "?";
  const [LeaveDialog, confirmLeave] = UseConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace"
  );
  const [RemoveDialog, confirmRemove] = UseConfirm(
    "Remove member",
    "Are you sure you want to remove this member"
  );
  const [UpdateDialog, confirmUpdate] = UseConfirm(
    "Change role",
    "Are you sure you want to change this member's role"
  );

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };
  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You left the workspace");

          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };
  const onRoleUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) return;
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role changed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      }
    );
  };

  if (isMemberLoading || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5  text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <UpdateDialog />
      <LeaveDialog />
      <RemoveDialog />
      <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col p-4 items-center justify-center">
          <Avatar className="max-w-[256px] max0h-[256px] size-full">
            <AvatarImage className="" src={member.user.image} />
            <AvatarFallback className="bg-sky-500 flex items-center justify-center aspect-square text-white text-7xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" className="w-full capitalize">
                    {member.role}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onRoleUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={onRemove}
                variant="destructive"
                className="w-full"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== "admin" ? (
            <div className="mt-4">
              <Button
                onClick={onLeave}
                className="w-full"
                variant="destructive"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4 gap-1">
          <p className="text-sm font-bold gap-2">Contact Information</p>
          <div className="size-9 rounded-md bg-muted  flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm hover:underline text-[#1264a3] "
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};