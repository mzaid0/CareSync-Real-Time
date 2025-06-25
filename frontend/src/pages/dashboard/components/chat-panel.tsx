import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoMdClose, IoIosSend } from "react-icons/io";

interface ChatPanelProps {
    chatOpen: boolean;
    setChatOpen: (open: boolean) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ chatOpen, setChatOpen }) => {
    const [chatMessage, setChatMessage] = useState("");

    if (!chatOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl p-6 border-l border-green-100 z-50">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Communication Hub</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setChatOpen(false)}
                    className="text-gray-600 hover:bg-green-50 rounded-full"
                >
                    <IoMdClose size={24} />
                </Button>
            </div>

            <div className="h-[calc(100%-120px)] overflow-y-auto mb-4">
                <div className="space-y-4">
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-xs">
                            <p className="text-gray-900">Hi John, how are you feeling today?</p>
                            <p className="text-xs text-gray-500 mt-1">Dr. Sarah Johnson • 10:15 AM</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-green-100 rounded-2xl rounded-tr-none p-4 max-w-xs">
                            <p className="text-gray-900">Feeling much better today, thank you!</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">You • 10:18 AM</p>
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-xs">
                            <p className="text-gray-900">That's great to hear. Don't forget to take your Metformin after breakfast.</p>
                            <p className="text-xs text-gray-500 mt-1">Dr. Sarah Johnson • 10:20 AM</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="py-3 px-4 rounded-xl border-green-200 focus:ring-green-500 focus:border-green-500"
                />
                <Button className="bg-green-500 hover:bg-green-600 rounded-xl h-full">
                    <IoIosSend className="text-lg" />
                </Button>
            </div>
        </div>
    );
};