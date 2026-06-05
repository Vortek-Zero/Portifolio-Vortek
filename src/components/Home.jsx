import React, { Suspense } from "react";
import Hero from "./Hero";
import TechMarquee from "./TechMarquee";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Testimonials from "./Testimonials";
import PageTransition from "./PageTransition";
import TerminalLoader from "./TerminalLoader";

// Lazy Loaded Heavy Components
const Python3D = React.lazy(() => import("./Python3D"));
const PythonTextParticle = React.lazy(() => import("./PythonTextParticle"));
const SpaceInvaders = React.lazy(() => import("./SpaceInvaders"));

export default function Home() {
  const textTr = { scale: 0.65, x: 395, y: -515 };

  return (
    <PageTransition>
      <Hero />
      <TechMarquee />
      <div className="about-experience">
        <div
          className="about-container"
          style={{
            transform: "scale(1.2) translate(-100px, -170px)",
          }}
        >
          <About />
        </div>
        <div
          className="python-container"
          style={{
            transform: "scale(1.35) translate(70px, -105px)",
          }}
        >
          <Suspense fallback={<TerminalLoader />}>
            <Python3D />
          </Suspense>
        </div>
      </div>
      <div
        className="python-text-section"
        style={{
          transform: `scale(${textTr.scale}) translate(${textTr.x}px, ${textTr.y}px)`,
        }}
      >
        <Suspense fallback={<TerminalLoader />}>
          <PythonTextParticle />
        </Suspense>
      </div>
      <Skills />
      <Projects />

      <section className="intermezzo">
        <div className="philosophical-quote">
          <p className="quote-text">
            "Grandes sistemas não são apenas construídos; eles são cultivados na interseção entre a lógica implacável e a imaginação sem limites."
          </p>
          <span className="quote-author">Vortek Systems</span>
        </div>

        <Suspense fallback={<TerminalLoader />}>
          <SpaceInvaders />
        </Suspense>
      </section>

      <Testimonials />
      <Contact />
    </PageTransition>
  );
}
