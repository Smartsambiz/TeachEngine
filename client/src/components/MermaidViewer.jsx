import { useEffect, useRef } from "react";
import mermaid from "mermaid";

// Initialize the global layout settings to match your "Cyber-Academy" theme
mermaid.initialize({
  startOnLoad: false,
  theme: "dark", 
  securityLevel: "loose"
});

export default function MermaidViewer({ chartCode }) {
  const elementRef = useRef(null);

  useEffect(() => {
    // If the AI didn't return a flowchart code string for this section, skip it
    if (!chartCode || chartCode.trim() === "") return;

    const renderDiagram = async () => {
      try {
        // Generate a random ID so multiple diagrams on a single page never clash
        const uniqueId = `mermaid-${Math.floor(Math.random() * 100000)}`;
        
        if (elementRef.current) {
          elementRef.current.innerHTML = "";
          
          // Request the core engine to compile the raw string array into a vector graphic paths
          const { svg } = await mermaid.render(uniqueId, chartCode);
          elementRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid parsing error:", err);
      }
    };

    renderDiagram();
  }, [chartCode]);

  if (!chartCode || chartCode.trim() === "") return null;

  return (
    <div className="my-6 p-6 bg-slate-900 border border-slate-800 rounded-xl flex justify-center overflow-x-auto shadow-inner">
      <div ref={elementRef} className="w-full max-w-full flex justify-center text-slate-200" />
    </div>
  );
}
