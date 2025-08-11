import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import HTMLFlipBook from "react-pageflip";

// Page size (one page)
const PAGE_W = 500; // px
const PAGE_H = 380; // px

// Toggle this to enable/disable the cover glide animation
const ENABLE_GLIDE = true;

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
  const [pageIndex, setPageIndex] = useState(0);

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
    setPageIndex(idx);
    setPhase(idx > 0 ? "open" : "closed");
  };

  const handleCoverClick = () => {
    const inst = getInst();
    if (!inst) return;

    if (ENABLE_GLIDE) {
      // OPTION 1: Glide to right before opening
      setPhase("glide");
      setTimeout(() => {
        if (typeof inst.flipNext === "function") inst.flipNext();
      }, 50);
    } else {
      // OPTION 2: Instant open (no glide)
      if (typeof inst.flipNext === "function") inst.flipNext();
    }
  };

  const flipNext = () => {
    const inst = getInst();
    if (inst && typeof inst.flipNext === "function") inst.flipNext();
  };

  const flipPrev = () => {
    const inst = getInst();
    if (inst && typeof inst.flipPrev === "function") inst.flipPrev();
  };

  useEffect(() => {
  const onKey = (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (phase === "closed") {
        handleCoverClick(); // <-- uses glide if enabled
      } else {
        flipNext();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      flipPrev();
    }
  };

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [phase]);

  

  return (
    <div className="viewport">
      {/* Background image layer (opacity controlled via CSS) */}
        {/* <img */}
        {/* src="/pages/1.png" */}
        {/* alt="background" */}
        {/* className="bg-image" */}
        {/* aria-hidden="true" */}
      {/* /> */}
      <div
        className={`book-wrap ${phase}`}
        style={{ width: PAGE_W * 2, height: PAGE_H, "--pageW": `${PAGE_W}px` }}
      >
        <HTMLFlipBook
          className="flipbook"
          ref={bookRef}
          onInit={handleFlip}
          onFlip={handleFlip}
          width={PAGE_W}
          height={PAGE_H}
          drawShadow
          maxShadowOpacity={1}
          style={{ width: "100%", height: "100%" }}
          showCover
          showPageCorners
          useMouseEvents
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
      {/* Side navigation arrows (moved outside .book-wrap, now direct children of .viewport) */}
      <button
        className="nav-arrow nav-prev"
        aria-label="Previous page"
        onClick={flipPrev}
        disabled={pageIndex <= 0}
      >
        ◀
      </button>
      <button
        className="nav-arrow nav-next"
        aria-label="Next page"
        onClick={flipNext}
        disabled={pageIndex >= pageImages.length - 1}
      >
        ▶
      </button>
    </div>
  );
}

export default App;