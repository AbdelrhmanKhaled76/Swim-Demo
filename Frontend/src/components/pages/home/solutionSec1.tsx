import { useState, useRef, useEffect } from "react";
import type { MouseEvent, ReactNode } from "react";

import Sign from "../../sign/sign";
import anchorPic from "../../../assets/images/anchor 1.png";
import laptopPic from "../../../assets/images/Rectangle.png";

const noiseBg = `url("../../../assets/images/noise.jpg")`;

function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(80px)";
      case "down":
        return "translateY(-80px)";
      case "left":
        return "translateX(80px)";
      case "right":
        return "translateX(-80px)";
      default:
        return "translateY(80px)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0px, 0px)" : getTransform(),
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SolutionSec1() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform:
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rotateX = (0.5 - y) * 25; // Tilt up/down
    const rotateY = (x - 0.5) * 25; // Tilt left/right

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform:
        "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    });
  };

  return (
    <div className="relative w-full bg-[#0a2342] overflow-hidden py-16 md:py-24 px-4 md:px-6 lg:px-8 min-h-[800px]">
      {/* Background Noise overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: noiseBg }}
      ></div>

      <div className="container mx-auto relative h-full z-10">
        {/* Title */}
        <h2 className="text-center md:text-left text-white text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold tracking-wide mb-12 header uppercase  leading-snug drop-shadow-lg">
          AND MUCH MUCH MORE ... SWIM SOLVES THIS
        </h2>

        <div className="relative w-full min-h-[600px] flex justify-center items-center mt-10">
          {/* SWIM Background Letters (S W, I M) */}
          <div className="absolute left-0 lg:-left-10 tp-1/2 lg:top-1/3 transform -translate-y-1/2 grid grid-cols-2 gap-x-12 gap-y-8 text-[#051426] text-[6rem] md:text-[8rem] lg:text-[10rem] font-black leading-none select-none z-0 mix-blend-multiply opacity-80">
            <span className="header font-bold">S</span>
            <span className="header font-bold">W</span>
            <span className="header font-bold">I</span>
            <span className="header font-bold">M</span>
          </div>

          {/* Laptop Image with 3D Tilt Effect */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 w-[90%] md:w-[700px] lg:w-[800px] flex justify-center items-center"
            style={{ perspective: "1200px" }}
          >
            <img
              src={laptopPic}
              className="w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out"
              style={{ ...tiltStyle, transformStyle: "preserve-3d" }}
              alt="App interface on laptop"
            />
          </div>

          {/* Floating Sign 1: Multi-Branch Management */}
          <ScrollReveal
            direction="left"
            delay={0.2}
            className="absolute top-[5%] md:-top-10 right-0 md:-right-5 z-20 pointer-events-none"
          >
            <div className="bg-[#f8f8f8] py-6 px-8 shadow-2xl relative">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: noiseBg }}
              ></div>
              <Sign title="MULTI-BRANCH MANAGEMENT" />
            </div>
          </ScrollReveal>

          {/* Floating Sign 2: Real-time stock tracking */}
          <ScrollReveal
            direction="right"
            delay={0.4}
            className="absolute bottom-[5%] md:-bottom-10 left-0 md:left-5 z-20 pointer-events-none"
          >
            <div className="bg-[#f8f8f8] py-6 px-8 shadow-2xl relative">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: noiseBg }}
              ></div>
              <Sign title="REAL-TIME STOCK TRACKING" />
            </div>
          </ScrollReveal>

          {/* Bottom dots */}
          <div className="absolute bottom-4 lg:-bottom-10 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-6 z-0 opacity-60 mix-blend-multiply">
            <div className="w-8 h-8 rounded-full bg-[#051426]"></div>
            <div className="w-8 h-8 rounded-full bg-[#051426]"></div>
            <div className="w-8 h-8 rounded-full bg-[#051426]"></div>
            <div className="w-8 h-8 rounded-full bg-[#051426]"></div>
            <div className="w-8 h-8 rounded-full bg-[#051426]"></div>
            <div className="w-8 h-8 rounded-full bg-[#051426]"></div>
          </div>

          {/* Anchor Image */}
          <img
            src={anchorPic}
            className="absolute -bottom-20 -right-10 md:-right-20 w-[250px] md:w-[350px] object-contain z-30 drop-shadow-2xl pointer-events-none"
            alt="Anchor"
          />
        </div>
      </div>
    </div>
  );
}

export default SolutionSec1;
