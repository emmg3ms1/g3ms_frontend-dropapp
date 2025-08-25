import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Folder, 
  HelpCircle,
  LogIn,
  Plus,
  Check,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import GatedSignupForm from "@/components/GatedSignupForm";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const getMenuItems = (navigate: any) => [
  {
    title: "  🔢 Math & Logic",
    action: () => {}
  },
  {
    title: "  💻 Code Creation", 
    action: () => {}
  },
  {
    title: "  📖 Reading & Writing",
    action: () => {}
  },
  {
    title: "  💡 Science & Curiosity",
    action: () => {}
  },
  {
    title: "  🧠 Test Prep",
    action: () => {}
  },
  {
    title: "  🎭 Arts & Creativity",
    action: () => {}
  },
  {
    title: "  📚 Social Studies & Civics",
    action: () => {}
  },
  {
    title: "  🌱 Life & Career",
    action: () => {}
  },
  {
    title: "  💬 Communication Skills",
    action: () => {}
  },
  {
    title: "  🧮 Financial Literacy",
    action: () => {}
  },
  {
    title: "  🧰 Career & Workforce Skills",
    action: () => {}
  },
  {
    title: "  ❤️ Mental Health & Wellness",
    action: () => {}
  },
  {
    title: "  👥 Social-Emotional Learning",
    action: () => {}
  },
  {
    title: "  🌍 Global Citizenship",
    action: () => {}
  }
];

const bottomItems = [
  { 
    title: "Log In / Sign Up", 
    icon: LogIn, 
    action: () => window.open('https://webapp.g3ms.co/login', '_blank')
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user } = useAuth();

  // Temporary bypass for testing - matches DropCompletion component
  const BYPASS_AUTH = true;
  const isLoggedIn = BYPASS_AUTH || !!user;

  const handleCompleteDropClick = () => {
    if (isLoggedIn) {
      navigate("/drops/main"); // Navigate to main drops page
    } else {
      navigate("/drops/main"); // Same destination regardless
    }
  };

  const menuItems = getMenuItems(navigate);

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="w-full bg-gradient-to-r from-g3ms-purple to-g3ms-green hover:from-pink-600 hover:to-emerald-600 text-white rounded-lg py-3 font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create or Complete a Drop
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={() => navigate("/educator/dashboard")}
              >
                <Plus className="mr-3 h-4 w-4 text-green-600" />
                <span>Create a Drop</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={handleCompleteDropClick}
              >
                <Check className="mr-3 h-4 w-4 text-blue-600" />
                <span>Complete a Drop</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={() => navigate("/brands/dashboard")}
              >
                <Rocket className="mr-3 h-4 w-4 text-purple-600" />
                <span>Launch a Branded Drop</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon"
                className="bg-gradient-to-r from-g3ms-purple to-g3ms-green hover:from-pink-600 hover:to-emerald-600 text-white rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={() => navigate("/educator/dashboard")}
              >
                <Plus className="mr-3 h-4 w-4 text-green-600" />
                <span>Create a Drop</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={handleCompleteDropClick}
              >
                <Check className="mr-3 h-4 w-4 text-blue-600" />
                <span>Complete a Drop</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer py-3"
                onClick={() => navigate("/brands/dashboard")}
              >
                <Rocket className="mr-3 h-4 w-4 text-purple-600" />
                <span>Launch a Branded Drop</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={item.action}
                  className="w-full justify-start text-gray-700 hover:bg-gray-100 py-2"
                >
                  {!collapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                  {collapsed && (
                    <span className="text-xs font-bold">
                      {item.title.charAt(0)}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        {!isLoggedIn && (
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <GatedSignupForm audience="student">
                  <SidebarMenuButton>
                    <div className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-lg w-full cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                  </SidebarMenuButton>
                </GatedSignupForm>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}