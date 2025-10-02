import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole, getRole, setRole } from "@/lib/role";
import { useState, useEffect } from "react";
import { User, Crown, Users } from "lucide-react";

const roleIcons = {
  public: User,
  agent: Users,
  owner: Crown,
};

const roleLabels = {
  public: "Public User",
  agent: "Real Estate Agent",
  owner: "Broker/Owner",
};

const roleColors = {
  public: "text-muted-foreground",
  agent: "text-blue-500",
  owner: "text-amber-500",
};

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<UserRole>(getRole());

  useEffect(() => {
    const handleRoleChange = (event: Event) => {
      const customEvent = event as CustomEvent<UserRole>;
      setCurrentRole(customEvent.detail);
    };

    window.addEventListener("roleChanged", handleRoleChange);
    return () => window.removeEventListener("roleChanged", handleRoleChange);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setCurrentRole(role);
    window.location.reload(); // Reload to apply role-based changes
  };

  const RoleIcon = roleIcons[currentRole];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 animate-fade-in"
        >
          <RoleIcon className={`h-4 w-4 ${roleColors[currentRole]}`} />
          <span className="hidden sm:inline">{roleLabels[currentRole]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 animate-scale-in">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleRoleChange("public")}
          disabled={currentRole === "public"}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Public User</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleRoleChange("agent")}
          disabled={currentRole === "agent"}
          className="cursor-pointer"
        >
          <Users className="mr-2 h-4 w-4 text-blue-500" />
          <span>Real Estate Agent</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleRoleChange("owner")}
          disabled={currentRole === "owner"}
          className="cursor-pointer"
        >
          <Crown className="mr-2 h-4 w-4 text-amber-500" />
          <span>Broker/Owner</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
