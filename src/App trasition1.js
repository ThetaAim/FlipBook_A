import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import HTMLFlipBook from "react-pageflip";

const pageImages = [
  "/pages/1.png",
  "/pages/2.png",
  "/pages/3.png",
  "/pages/4.png",
  "/pages/5.png",
  "/pages/6.png",
  "/pages/7.png",
  "/pages/8.png",
  "/pages/9.png",
  "/pages/10.png",
];

function App() {
  const bookRef = useRef(null);
  const [phase, setPhase] = useState("closed");

  // Helper to get the instance safely
  const getInst = () => {
    try {
      return bookRef.current?.pageFlip?.();
    } catch {
      return null;
    }
  };

  const handleFlip = () => {
    const inst = getInst();
    if (!inst) return;
    const idx = typeof inst.getCurrentPageIndex === "function" ? inst.getCurrentPageIndex() : 0;
    if (idx > 0) {
      setPhase("open");
    }
  };

  const handleCoverClick = () => {
    // Start the glide-to-right animation first, then flip programmatically
    setPhase("glide");
    const inst = getInst();
    if (!inst) return;
    // Let the CSS transition begin, then trigger the flip
    setTimeout(() => {
      if (typeof inst.flipNext === "function") inst.flipNext();
    }, 50);
  };

  return (
    <div className="viewport">
      <div className={`book-wrap ${phase}`}>
        <HTMLFlipBook
          className="flipbook"
          ref={bookRef}
          onFlip={handleFlip}
          width={400}
          height={560}
          style={{ width: "100%", height: "100%" }}
          showCover
        >
          {pageImages.map((src, i) => (
            <div key={i} className="page">
              <img src={src} alt={`Page ${i + 1}`} className="page-image" />
            </div>
          ))}
        </HTMLFlipBook>

        {/* Click overlay only when closed (cover) */}
        {phase === "closed" && (
          <button className="cover-hit" aria-label="Open book" onClick={handleCoverClick} />
        )}
      </div>
    </div>
  );
}

export default App;