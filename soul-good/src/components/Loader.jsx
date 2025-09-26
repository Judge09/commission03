import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-black" />
    </div>
  );
}
