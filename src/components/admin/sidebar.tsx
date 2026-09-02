"use client";


import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Type,
    Image as ImageIcon,
    Grid,
    MessageSquare,
    Settings,
    BarChart,
    Menu,
    ChevronRight,
    MonitorPlay,
    Plus,
    BookOpen,
    Users
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useContent } from "@/lib/content-context";

interface AdminSidebarProps {
    activeSection: string;
    onSelectSection: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSelectSection }: AdminSidebarProps) {
    const { content } = useContent();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Define the structure with nested items
    type SidebarItem = {
        id: string;
        label: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon: React.ComponentType<any>;
        children?: SidebarItem[];
    };

    const sections: SidebarItem[] = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "presentation", label: "Presentation", icon: MonitorPlay },
        {
            id: "home-page",
            label: "Home Page",
            icon: Grid,
            children: [
                { id: "hero", label: "Hero Section", icon: ImageIcon },
                { id: "imageCarousel", label: "Carousel", icon: ImageIcon },
                { id: "vision", label: "Vision", icon: Type },
                { id: "services", label: "Services", icon: Grid },
                { id: "methodology", label: "Methodology", icon: Settings },
                { id: "partners", label: "Partners", icon: Grid },
                { id: "about", label: "About Section", icon: Type },
                { id: "add-section", label: "Add New Section", icon: Plus },
            ]
        },
        {
            id: "about-page",
            label: "About Page",
            icon: Type,
            children: [
                { id: "about.hero", label: "Hero", icon: ImageIcon },
                { id: "about.stats", label: "Stats", icon: BarChart },
                { id: "about.mission", label: "Mission", icon: Type },
                { id: "about.values", label: "Values", icon: Grid },
                { id: "about.timeline", label: "Timeline", icon: Settings },
                { id: "about.leadership", label: "Leadership", icon: Grid },
            ]
        },
        {
            id: "services-page",
            label: "Services Page",
            icon: Grid,
            children: [
                { id: "services.header", label: "Header", icon: Type },
                { id: "services.items", label: "Overview Items", icon: Grid },
                ...((content.servicesData as Array<{ slug: string; title: string }>) || []).map((s) => ({
                    id: `servicesData:${s.slug}`,
                    label: s.title,
                    icon: Settings
                }))
            ]
        },
        {
            id: "contact-page",
            label: "Contact Page",
            icon: MessageSquare,
            children: [
                { id: "contact.info", label: "Contact Info", icon: Type },
                { id: "contact.locations", label: "Locations", icon: Grid },
                { id: "contact.form", label: "Form Settings", icon: Settings },
            ]
        },
        {
            id: "careers-page",
            label: "Careers Page",
            icon: Users,
            children: [
                { id: "careers.hero", label: "Hero", icon: ImageIcon },
                { id: "careers.culture", label: "Culture", icon: Type },
                { id: "careers.benefits", label: "Benefits", icon: Grid },
                { id: "careers.jobs", label: "Jobs", icon: Settings },
            ]
        },
        {
            id: "training-page",
            label: "Training Page",
            icon: BookOpen,
            children: [
                { id: "training.hero", label: "Hero", icon: ImageIcon },
                { id: "training.courses", label: "Courses", icon: Grid },
            ]
        },
        { id: "footer", label: "Footer", icon: Menu },
        { id: "inbox", label: "Inbox", icon: MessageSquare },
        { id: "pages", label: "Pages Manager", icon: Type },
        { id: "navigation", label: "Navigation Menu", icon: Menu },
        { id: "analytics", label: "Analytics", icon: BarChart },
    ];

    // We need a sub-component to handle the toggle state of groups independently if we want accordions
    // But for this first pass, let's just assume "Home Page" is a grouper that acts as an accordion header.
    // However, if I select "Hero", "Home Page" should probably stay open.

    return (
        <aside className={cn(
            "h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                {!isCollapsed && <span className="font-bold text-white tracking-wider">The Engine</span>}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-400 hover:text-white" title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                    <Menu size={20} />
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {sections.map(section => (
                        <SidebarGroup
                            key={section.id}
                            item={section}
                            activeSection={activeSection}
                            onSelect={onSelectSection}
                            isSidebarCollapsed={isCollapsed}
                        />
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 flex flex-col gap-4">
                {!isCollapsed && (
                    <div className="flex justify-center">
                        <ThemeToggle />
                    </div>
                )}
                {!isCollapsed && (
                    <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-mono mb-0.5">App v1.2.0 (Editor Update)</p>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest">Data v{content.metadata?.version || 0}</p>
                    </div>
                )}
            </div>
        </aside>
    );
}

// Helper Components
type SidebarGroupProps = {
    item: SidebarItem;
    activeSection: string;
    onSelect: (id: string) => void;
    isSidebarCollapsed: boolean;
};

// Define SidebarItem type again if not exported, or just use it if in scope.
// Since it is inside the function scope above, we might need to redefine or move it out.
// Let's move the type definition to the top of the file in the next step or just duplicate slightly.
type SidebarItem = {
    id: string;
    label: string;
    icon: React.ComponentType<{ size: number; strokeWidth?: number }>;
    children?: SidebarItem[];
};

function SidebarGroup({ item, activeSection, onSelect, isSidebarCollapsed }: SidebarGroupProps) {
    // Check if any child is active to auto-expand
    const hasActiveChild = item.children?.some(c => c.id === activeSection);
    const [isOpen, setIsOpen] = useState(hasActiveChild || false);

    // Sync open state with external active section changes ONLY if it becomes active (don't auto-close)
    if (hasActiveChild && !isOpen) setIsOpen(true);

    const handleClick = () => {
        if (item.children) {
            setIsOpen(!isOpen);
        } else {
            onSelect(item.id);
        }
    };

    const isActive = activeSection === item.id;

    return (
        <li className="mb-1">
            <button
                onClick={handleClick}
                className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium relative group",
                    isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
                title={isSidebarCollapsed ? item.label : undefined}
            >
                <item.icon size={20} strokeWidth={1.5} />
                {!isSidebarCollapsed && (
                    <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.children && (
                            <ChevronRight size={14} className={cn("transition-transform", isOpen ? "rotate-90" : "")} />
                        )}
                        {isActive && !item.children && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </>
                )}
            </button>
            {/* Render Children */}
            {item.children && !isSidebarCollapsed && isOpen && (
                <ul className="mt-1 space-y-1 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-slate-800">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {item.children.map((child: any) => (
                        <li key={child.id}>
                            <button
                                onClick={() => onSelect(child.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg transition-colors text-xs font-medium",
                                    activeSection === child.id
                                        ? "text-blue-400 bg-slate-800/50"
                                        : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                <child.icon size={16} strokeWidth={1.5} />
                                <span>{child.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}
