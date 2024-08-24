import { BorderBeam } from "@/components/ui/border-beam";

function AIChatHistory() {
  // ... existing code ...

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full rounded-xl bg-gray-900 overflow-hidden">
        <BorderBeam 
          size={1000}  // Adjust this value based on your container size
          duration={15}
          borderWidth={2}
          colorFrom="#4a9eff"
          colorTo="#9747ff"
        />
        <div className="h-full overflow-y-auto p-4">
          {/* ... existing chat messages rendering ... */}
        </div>
        {/* ... existing input field and send button ... */}
      </div>
    </div>
  );
}

export default AIChatHistory;