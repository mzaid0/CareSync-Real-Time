import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSend } from "react-icons/io";
import { MdClose } from "react-icons/md";

interface ChatPanelProps {
    chatOpen: boolean;
    setChatOpen: (open: boolean) => void;
    chatMessage: string;
    setChatMessage: (message: string) => void;
    handleSendMessage: () => void;
}

export const ChatPanel = ({ chatOpen, setChatOpen, chatMessage, setChatMessage, handleSendMessage }: ChatPanelProps) => {
    if (!chatOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl p-6 border-l border-gray-200 z-30">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-400">Communication Hub</h3>
                <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} aria-label="Close chat">
                    <MdClose size={24} />
                </Button>
            </div>
            <div className="mt-4 flex gap-2">
                <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    aria-label="Type a message"
                />
                <Button onClick={handleSendMessage}>
                    <IoIosSend />
                </Button>
            </div>
        </div>
    );
};