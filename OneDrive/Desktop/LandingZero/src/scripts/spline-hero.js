import { Application } from "@splinetool/runtime";

const SPLINE_URL = "https://prod.spline.design/M1xfE4sHHL-Zx4C2/scene.splinecode";

// Camera settings to lock the view
const CAMERA = {
  position: [0.00, 1.75, 6.25],
  target: [0.00, 0.80, 0.00],
};

async function initSpline() {
  const canvas = document.getElementById("home3d");
  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  const app = new Application(canvas);

  // Utility: resize helper to keep canvas crisp without CSS scaling.
  function fit() {
    const { clientWidth: w, clientHeight: h } = canvas;
    // runtime manages DPR; just ensure it has correct logical size
    app.setSize(w, h);
  }

  try {
    console.log("Loading Spline scene...");
    await app.load(SPLINE_URL);
    console.log("Spline scene loaded successfully");

    // Disable any orbit/pan/zoom so the view never moves
    if (app.controls) {
      app.controls.enabled = false;
      console.log("Controls disabled");
    }

    // HARD-LOCK CAMERA (best practice)
    const cam = app.scene?.activeCamera;
    if (cam && Array.isArray(CAMERA.position) && Array.isArray(CAMERA.target)) {
      const [px, py, pz] = CAMERA.position;
      const [tx, ty, tz] = CAMERA.target;
      if ([px,py,pz,tx,ty,tz].every((n) => typeof n === "number")) {
        cam.position.set(px, py, pz);
        cam.target.set(tx, ty, tz);
        console.log("Camera locked to position:", CAMERA.position, "target:", CAMERA.target);
      }
    }

    // Keep sizing correct on load and resize
    fit();
    window.addEventListener("resize", fit);
    
    // Initial fit after a brief delay to ensure proper sizing
    setTimeout(fit, 100);
    
  } catch (error) {
    console.error("Error loading Spline scene:", error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpline);
} else {
  initSpline();
}

