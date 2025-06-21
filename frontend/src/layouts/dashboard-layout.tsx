import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Menu button for mobile screens */}
            <Button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50"
                aria-label="Open sidebar"
            >
                Menu
            </Button>
            {/* Backdrop for mobile screens when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            {/* Sidebar with state props */}
            <Sidebar sidebarOpen={isSidebarOpen} setSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1">
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
