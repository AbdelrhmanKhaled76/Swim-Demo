import Sign from "../../sign/sign";
import mobileMockup from "../../../assets/images/iphone-15-pro-mockup-v1-front-view 3.png";
import whalePic from "../../../assets/images/whale-tale.png";

const noiseBg = `url("../../../assets/images/noise.jpg")`;

function SolutionSec2() {
  return (
    <div className="relative w-full bg-[#0a2342] overflow-hidden py-16 md:py-24 px-4 md:px-6 lg:px-8 min-h-[800px]">
      {/* Background Noise overlay */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: noiseBg }}
      ></div>

      <div className="container mx-auto relative h-full z-10">
        {/* Title */}
        <h2 className="uppercase text-center md:text-left md:inline text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-white mb-10 md:mb-[60px] tracking-[1px] header transition-transform hover:scale-105 duration-500 relative z-20">
          EVEN MORE FEATURES ?!!!
        </h2>

        <style>{`
          @keyframes float-mobile {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-float-mobile {
            animation: float-mobile 6s ease-in-out infinite;
          }
        `}</style>

        <div className="relative w-full min-h-[700px] flex justify-center items-center mt-10">
          {/* Background Letters (THE BEST SERVICE) */}
          <div className="absolute right-4 lg:right-10 top-1/2 transform -translate-y-1/2 flex gap-x-8 md:gap-x-12 text-[#051426] text-[4rem] md:text-[6rem] lg:text-[8rem] header uppercase leading-none select-none z-0 mix-blend-multiply opacity-80">
            <div className="flex flex-col gap-4">
              <span>T</span>
              <span>H</span>
              <span>E</span>
            </div>
            <div className="flex flex-col gap-4">
              <span>B</span>
              <span>E</span>
              <span>S</span>
              <span>T</span>
            </div>
            <div className="flex flex-col gap-4">
              <span>S</span>
              <span>E</span>
              <span>R</span>
              <span>V</span>
              <span>I</span>
              <span>C</span>
              <span>E</span>
            </div>
          </div>

          {/* Whale Tail Image (Bottom Left) */}
          <img
            src={whalePic}
            className="absolute  w-75 md:w-[519px] -bottom-20 -left-10 md:-bottom-50 md:-left-50  object-contain z-10 "
            alt="Whale tail"
          />

          {/* Mobile Mockup Image */}
          <img
            src={mobileMockup}
            className="relative z-20 w-[65%] md:w-[350px] lg:w-[600px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-float-mobile"
            alt="Mobile App Interface"
          />

          {/* Floating Sign 1: ORDERING SYSTEM READY */}
          <div className="absolute top-[10%] left-0 md:left-[5%] z-30 pointer-events-none">
            <div className="relative inline-block bg-[#f8f8f8] py-6 px-8 shadow-2xl">
              <Sign title="ORDERING SYSTEM READY" />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none rounded-sm"
                style={{ backgroundImage: noiseBg }}
              ></div>
            </div>
          </div>

          {/* Floating Sign 2: LOGO CUSTOMIZATION */}
          <div className="absolute bottom-[10%] right-0 md:right-[5%] z-30 pointer-events-none">
            <div className="relative inline-block bg-[#f8f8f8] py-6 px-8 shadow-2xl">
              <Sign title="LOGO CUSTOMIZATION" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionSec2;
