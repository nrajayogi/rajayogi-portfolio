"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SectionEditor } from "@/components/admin/section-editor";
import { Hero } from "@/components/sections/hero";
import { ImageCarousel } from "@/components/sections/image-carousel";
// Import other sections as we refactor them
import { Services } from "@/components/sections/services";
import { Methodology } from "@/components/sections/methodology";
import { VisionStatement } from "@/components/sections/vision-statement";
import { Partners } from "@/components/sections/partners";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Training } from "@/components/sections/training";
import { Careers } from "@/components/sections/careers";
import { Inbox } from "@/components/admin/inbox";
import { Dashboard } from "@/components/admin/dashboard";
import { Analytics } from "@/components/admin/analytics";
import { PagesManager } from "@/components/admin/pages-manager"; // To be created
import { PresentationEditorNew as PresentationEditor } from "@/components/admin/presentation-editor-new";
import { MenuEditor } from "@/components/admin/menu-editor"; // To be created
import { Footer } from "@/components/layout/footer";
import { ServicePageTemplate } from "@/components/templates/service-page-template";
import {
    Monitor,
    Tablet,
    Smartphone,
    Save,
    LogOut,
    Edit3,
    Eye,
    ChevronUp,
    ChevronDown,
    MonitorPlay,
    Grid,
    Settings,
    Type,
    MessageSquare,
    BookOpen,
    Image as ImageIcon
} from "lucide-react";
import { useContent } from "@/lib/content-context";
import { ThemeProvider } from "@/components/theme-provider";
import { PresentationPreview } from "@/components/admin/presentation-preview";

// ... PreviewComponents
const PreviewComponents: Record<string, React.ComponentType<unknown>> = {
    hero: Hero,
    imageCarousel: ImageCarousel,
    services: Services,
    methodology: Methodology,
    vision: VisionStatement,
    partners: Partners,
    about: About,
    contact: Contact,
    training: Training,
    careers: Careers,
    footer: Footer,
    presentation: PresentationPreview,
    // Add full page mappings or section mappings
    'about.hero': About,
    'about.stats': About,
    'about.mission': About,
    'about.values': About,
    'about.timeline': About,
    'about.leadership': About,
    'services.header': Services,
    'services.items': Services,
    'contact.info': Contact,
    'contact.locations': Contact,
    'contact.form': Contact,
    'training.hero': Training,
    'training.courses': Training,
    'careers.hero': Careers,
    'careers.culture': Careers,
    'careers.benefits': Careers,
    'careers.jobs': Careers,
};

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'large' | 'tablet' | 'mobile' | 'custom'>('desktop');
    const { content, isEditing, toggleEditing, updateContent } = useContent();
    const [isSaving, setIsSaving] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(true);

    // --- Resizing Logic ---
    const [customSize, setCustomSize] = useState({ width: 1200, height: 800 });
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            setCustomSize(prev => ({
                width: Math.max(320, prev.width + e.movementX * 2), // *2 because centered origin logic can be tricky, but here it's simple width
                height: Math.max(400, prev.height + e.movementY)
            }));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    // Middleware handles protection now. We can trust if we are here, we are authorized.
    useEffect(() => {
        setIsAuthorized(true);
    }, []);

    // Idle Timer (5 minutes = 300000ms)
    // We track mouse movement and keypresses to reset the timer.
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const logout = () => {
            handleLogout();
        };

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(logout, 5 * 60 * 1000); // 5 minutes
        };

        // Events to listen for
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        // Attach listeners
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            clearTimeout(timeout);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Increment Version
            const contentToSave = JSON.parse(JSON.stringify(content));
            if (!contentToSave.metadata) {
                contentToSave.metadata = { version: 0, lastUpdated: new Date().toISOString() };
            }
            contentToSave.metadata.version = (contentToSave.metadata.version || 0) + 1;
            contentToSave.metadata.lastUpdated = new Date().toISOString();

            const res = await fetch("/api/save-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contentToSave),
            });
            if (res.ok) {
                updateContent(contentToSave); // Update local state to reflect new version
                alert(`Saved! Version ${contentToSave.metadata.version}`);
            } else {
                const data = await res.json();
                alert(`Failed to save changes: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error saving changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            // 1. Call API to clear cookie server-side
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error(e);
        } finally {
            // 2. Force Hard Redirect to Login
            window.location.href = "/admin/login";
        }
    };

    const resolveData = (obj: any, key: string) => {
        if (!obj || !key) return null;

        // Handle servicesData lookup by slug: "servicesData:plm-services"
        if (key.includes(':')) {
            const [collection, slug] = key.split(':');
            const array = obj[collection];
            if (Array.isArray(array)) {
                return array.find((item: any) => item.slug === slug);
            }
        }

        const parts = key.split('.');
        let current = obj;
        for (const part of parts) {
            if (!current || current[part] === undefined) return null;
            current = current[part];
        }
        return current;
    };

    const activeSectionData = resolveData(content, activeSection);

    const isFullPage = activeSection === 'inbox' || activeSection === 'analytics' || activeSection === 'pages' || activeSection === 'navigation' || activeSection === 'presentation';

    // Helper to render preview based on active section
    const renderPreview = () => {
        if (activeSection.startsWith('servicesData:')) {
            const data = activeSectionData;
            if (!data) return <div className="flex items-center justify-center h-full text-slate-500">Service data not found</div>;
            return <ServicePageTemplate service={data} />;
        }

        const Component = PreviewComponents[activeSection];
        if (!Component) return <div className="flex items-center justify-center h-full text-slate-500">Select a section to edit</div>;

        return <Component />;
    };

    if (!isAuthorized) return null;



    return (
        // Removed forcedTheme="dark" to allow toggling
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar for Global Actions (Save, etc) */}
                    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="font-bold text-lg text-white">Admin Portal</h1>
                                {content.metadata && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        v{content.metadata.version} • {new Date(content.metadata.lastUpdated).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={toggleEditing}
                                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-colors border ${isEditing ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : 'text-slate-400 border-slate-700/50 hover:text-white hover:bg-slate-800'}`}
                            >
                                {isEditing ? <Edit3 size={12} /> : <Eye size={12} />}
                                {isEditing ? "Visual Mode On" : "Enable Visual Editing"}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-white px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-colors border border-slate-700/50 hover:bg-slate-800"
                            >
                                <LogOut size={12} />
                                Logout
                            </button>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSaving ? "Saving..." : "Push Changes Live"}
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Conditional Rendering based on Mode */}
                        {activeSection === 'inbox' && (
                            <div className="flex-1 overflow-hidden">
                                <Inbox />
                            </div>
                        )}

                        {activeSection === 'dashboard' && (
                            <div className="flex-1 overflow-hidden">
                                <Dashboard />
                            </div>
                        )}

                        {activeSection === 'pages' && (
                            <div className="flex-1 overflow-hidden">
                                <PagesManager />
                            </div>
                        )}

                        {activeSection === 'presentation' && (
                            <div className="flex-1 overflow-hidden">
                                <PresentationEditor />
                            </div>
                        )}

                        {activeSection === 'navigation' && (
                            <div className="flex-1 overflow-hidden">
                                <MenuEditor />
                            </div>
                        )}

                        {activeSection === 'analytics' && (
                            <div className="flex-1 overflow-hidden">
                                <Analytics />
                            </div>
                        )}

                        {activeSection === 'add-section' && (
                            <div className="flex-1 overflow-y-auto p-12 bg-slate-950">
                                <div className="max-w-4xl mx-auto">
                                    <h2 className="text-3xl font-bold text-white mb-2">Add New Section</h2>
                                    <p className="text-slate-400 mb-10">Choose a section to add to your Home page layout.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { id: 'hero', name: 'Hero (Main)', icon: MonitorPlay },
                                            { id: 'services', name: 'Services Grid', icon: Grid },
                                            { id: 'methodology', name: 'Process/Methodology', icon: Settings },
                                            { id: 'vision', name: 'Vision Statement', icon: Type },
                                            { id: 'partners', name: 'Partners/Logos', icon: Grid },
                                            { id: 'about', name: 'About Content', icon: Type },
                                            { id: 'contact', name: 'Contact Info', icon: MessageSquare },
                                            { id: "training", name: "Industrial Training", icon: BookOpen },
                                            { id: "imageCarousel", name: "Image Carousel", icon: ImageIcon }
                                        ].map((sec) => (
                                            <button
                                                key={sec.id}
                                                onClick={() => {
                                                    const newOrder = [...(content.sectionsOrder || [])];
                                                    if (!newOrder.includes(sec.id)) {
                                                        newOrder.push(sec.id);
                                                        updateContent({ ...content, sectionsOrder: newOrder });
                                                        setActiveSection(sec.id);
                                                    } else {
                                                        alert("Section is already in your layout.");
                                                    }
                                                }}
                                                className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                                    <sec.icon size={24} />
                                                </div>
                                                <h3 className="font-semibold text-white mb-1">{sec.name}</h3>
                                                <p className="text-xs text-slate-500">Inject onto Home Page</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isFullPage && activeSection !== 'dashboard' && (
                            <>
                                {/* Live Preview Pane (Top/Middle) - Takes remaining height */}
                                <div className="flex-1 bg-black relative flex flex-col min-h-0">
                                    <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 sticky top-0 z-10 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="flex bg-slate-800 rounded-md p-1 gap-1">
                                                <button
                                                    onClick={() => setPreviewMode('large')}
                                                    className={`p-1.5 rounded ${previewMode === 'large' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                                    title="Large Screen (1920px)"
                                                >
                                                    <Monitor size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setPreviewMode('desktop')}
                                                    className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                                    title="Desktop (Fit)"
                                                >
                                                    <Monitor size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setPreviewMode('tablet')}
                                                    className={`p-1.5 rounded ${previewMode === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                                    title="Tablet View"
                                                >
                                                    <Tablet size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setPreviewMode('mobile')}
                                                    className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                                    title="Mobile View"
                                                >
                                                    <Smartphone size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setPreviewMode('custom')}
                                                    className={`p-1.5 rounded ${previewMode === 'custom' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'} flex items-center gap-1 px-2`}
                                                    title="Custom Size"
                                                >
                                                    <span className="text-[10px] font-bold">FREE</span>
                                                </button>
                                            </div>
                                            {previewMode === 'custom' && (
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {Math.round(customSize.width)} x {Math.round(customSize.height)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">LIVE PREVIEW</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-stone-900/50 relative flex justify-center items-center p-8">
                                        {/* Preview Container with Dynamic Width */}
                                        <div
                                            style={previewMode === 'custom' ? { width: customSize.width, height: customSize.height } : undefined}
                                            className={`origin-center transition-all duration-300 bg-background shadow-2xl overflow-hidden relative group/preview ${previewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-3xl border-8 border-slate-800' :
                                                previewMode === 'tablet' ? 'w-[768px] h-[1024px] rounded-xl border-4 border-slate-800 scale-[.65]' :
                                                    previewMode === 'large' ? 'w-[1920px] h-[1080px] rounded-none border-0 scale-[.4]' :
                                                        previewMode === 'custom' ? 'rounded border border-slate-700' :
                                                            'w-full h-full rounded-none border-0'
                                                }`}
                                        >
                                            {/* Render the specific component being edited */}
                                            {renderPreview()}

                                            {/* Resize Handles for Custom Mode */}
                                            {previewMode === 'custom' && (
                                                <>
                                                    {/* Right Handle */}
                                                    <div
                                                        className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize hover:bg-blue-500/20 z-50 group-hover/preview:opacity-100 opacity-0 transition-opacity"
                                                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); }}
                                                    />
                                                    {/* Bottom Handle */}
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize hover:bg-blue-500/20 z-50 group-hover/preview:opacity-100 opacity-0 transition-opacity"
                                                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); }} // Needs logic pivot for Y
                                                    />
                                                    {/* Corner Handle */}
                                                    <div
                                                        className="absolute bottom-0 right-0 w-6 h-6 bg-slate-700/50 cursor-nwse-resize hover:bg-blue-600 z-50 flex items-center justify-center rounded-tl-lg"
                                                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); }}
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Editor Pane (Bottom) */}
                                <div className={`border-t border-slate-800 bg-slate-900/50 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isEditorOpen ? 'h-[350px]' : 'h-10'}`}>
                                    <div
                                        className="h-10 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur sticky top-0 z-10 cursor-pointer hover:bg-slate-800 transition-colors"
                                        onClick={() => setIsEditorOpen(!isEditorOpen)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-medium text-slate-400 uppercase tracking-wider select-none text-[10px]">
                                                Editing: <span className="text-white ml-2 text-sm normal-case">{activeSection}</span>
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mr-2">
                                                {isEditorOpen ? 'Collapse Tools' : 'Open Tools'}
                                            </span>
                                            {isEditorOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
                                        </div>
                                    </div>
                                    <div className={`flex-1 overflow-x-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent transition-opacity duration-200 ${isEditorOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                        <div className="w-max min-w-full">
                                            {/* We pass a specialized class/prop pattern by wrapping or context if needed, 
                                                but for now we'll just style the container to accommodate horizontal flow if the component supports it.
                                            */}
                                            <SectionEditor sectionKey={activeSection} orientation="horizontal" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
