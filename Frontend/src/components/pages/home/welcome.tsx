import Button from "../../button/button";
import whalePic from "../../../assets/images/whale-pic 1.png";

function Welcome() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 overflow-hidden">
      <div className="w-full mx-auto px-4 md:px-8 py-10  relative">
        <style>{`
        .whale-mask {
          -webkit-mask-image: url("${whalePic}");
          mask-image: url("${whalePic}");
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
        }
        .whale-mask-mobile {
          -webkit-mask-image: url("${whalePic}");
          mask-image: url("${whalePic}");
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float-mobile {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-mobile {
          animation: float-mobile 5s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

        {/* Subtle Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-5%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px]  rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-40 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[5%] left-[20%] w-[350px] md:w-[600px] h-[350px] md:h-[600px]  rounded-full mix-blend-multiply filter blur-[80px] md:blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <h1 className="uppercase text-center text-3xl md:text-4xl lg:text-5xl xl:text-7xl lg:whitespace-nowrap text-primary-600 mb-10 md:mb-[60px] tracking-[1px] header transition-transform hover:scale-105 duration-500 relative z-20">
          Take Full Control of Your Inventory
        </h1>

        <div className="relative w-full">
          {/* DESKTOP LAYOUT (Hidden on mobile) */}
          <div className="hidden lg:flex w-full h-[750px] relative justify-between items-start pointer-events-none group">
            {/* Left Panel: SWIM */}
            <div className="z-20 w-[480px] h-[240px] bg-primary-500 shadow-[12px_12px_0px_var(--color-primary-200)] flex items-center justify-center transition-transform hover:-translate-y-2 hover:shadow-[16px_16px_0px_var(--color-primary-200)] duration-300 cursor-pointer">
              <span className="text-[6rem] text-primary-100 tracking-[4px] header uppercase">
                SWIM
              </span>
            </div>

            {/* Right Panel */}
            <div className="pointer-events-auto z-20 flex flex-col items-start mt-[40px] mr-4">
              <a
                href="#pricing"
                className="block w-full max-w-[250px] mb-[40px]"
              >
                <Button
                  variant="primary"
                  className="w-full transition-transform hover:scale-105"
                >
                  CREATE SHIPMENT
                </Button>
              </a>

              <div className="grid grid-cols-3 gap-5 mb-[50px]">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-[22px] h-[22px] bg-primary-500 rounded-full animate-pulse-dot"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>

              <div className="flex flex-col gap-3 text-primary-500 text-[1.3rem] inter">
                <div className="hover:text-primary-300 transition-colors cursor-pointer">
                  Software
                </div>
                <div className="hover:text-primary-300 transition-colors cursor-pointer">
                  Warehouse
                </div>
                <div className="hover:text-primary-300 transition-colors cursor-pointer">
                  Inventory
                </div>
                <div className="hover:text-primary-300 transition-colors cursor-pointer">
                  Management
                </div>
              </div>
            </div>

            {/* Whale Container (Animated) */}
            <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto animate-float">
              {/* Whale Image with Hover Color Filter */}
              <img
                src={whalePic}
                className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none transition-all duration-700 group-hover:sepia group-hover:hue-rotate-[190deg] group-hover:saturate-200 group-hover:brightness-110"
                alt="Whale"
              />
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 w-full h-full object-contain object-center opacity-0 group-hover:opacity-30 transition-opacity duration-700 whale-mask bg-[#00bfff] pointer-events-none mix-blend-color-dodge"></div>
            </div>

            {/* Base Navy Text */}
            <div className="absolute top-[280px] left-0 flex flex-col z-[15] pointer-events-none w-full animate-float">
              <div className="text-[6.5rem] text-primary-500 leading-[1.1] whitespace-nowrap header ml-[20px]">
                DEEP SCALE
              </div>
              <div className="text-[6.5rem] text-primary-500 leading-[1.1] whitespace-nowrap header ml-[200px] mt-[5px]">
                LIGHT FOOTPRINT
              </div>
            </div>

            {/* Masked Light Blue Text */}
            <div className="absolute inset-0 z-[30] pointer-events-none whale-mask animate-float transition-all duration-700 group-hover:opacity-80">
              <div className="absolute top-[280px] left-0 flex flex-col w-full">
                <div className="text-[6.5rem] text-primary-100 leading-[1.1] whitespace-nowrap header ml-[20px] transition-colors duration-700 group-hover:text-white">
                  DEEP SCALE
                </div>
                <div className="text-[6.5rem] text-primary-100 leading-[1.1] whitespace-nowrap header ml-[200px] mt-[5px] transition-colors duration-700 group-hover:text-white">
                  LIGHT FOOTPRINT
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT (Hidden on desktop) */}
          <div className="flex flex-col lg:hidden w-full relative z-20 group">
            <div className="w-full max-w-[350px] h-[180px] bg-primary-500 shadow-[8px_8px_0px_var(--color-primary-200)] flex items-center justify-center mb-8 mx-auto transition-transform active:scale-95 duration-300">
              <span className="text-[4.5rem] text-primary-100 tracking-[2px] header uppercase">
                SWIM
              </span>
            </div>

            <a
              href="#pricing"
              className="block w-full max-w-[350px] mx-auto mb-8"
            >
              <Button
                variant="primary"
                className="w-full transition-transform active:scale-95"
              >
                CREATE SHIPMENT
              </Button>
            </a>

            <div className="flex flex-col gap-5 text-primary-500 text-[1.4rem] inter w-full max-w-[350px] mx-auto mb-8 font-medium">
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 bg-primary-800 rounded-full shrink-0 animate-pulse-dot"
                  style={{ animationDelay: "0s" }}
                ></div>
                Software
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 bg-primary-800 rounded-full shrink-0 animate-pulse-dot"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                Warehouse
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 bg-primary-800 rounded-full shrink-0 animate-pulse-dot"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                Inventory
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-6 h-6 bg-primary-800 rounded-full shrink-0 animate-pulse-dot"
                  style={{ animationDelay: "0.6s" }}
                ></div>
                Management
              </div>
            </div>

            {/* Mobile Whale & Text Overlap */}
            <div className="relative w-full h-[550px] mt-4 pointer-events-auto">
              {/* Animated Whale Container */}
              <div className="absolute inset-0 w-full h-full animate-float-mobile z-10 pointer-events-none">
                <img
                  src={whalePic}
                  className="absolute inset-0 w-full h-full object-contain object-center opacity-90 transition-all duration-700 group-hover:sepia group-hover:hue-rotate-[190deg] group-hover:saturate-200"
                  alt="Whale"
                />
              </div>

              {/* Mobile Base Navy Text */}
              <div className="absolute top-[35%] left-0 flex flex-col z-[15] pointer-events-none w-full animate-float-mobile">
                <div className="text-[13vw] sm:text-[4rem] text-primary-500 leading-[1.1] header whitespace-nowrap">
                  DEEP SCALE
                </div>
                <div className="text-[13vw] sm:text-[4rem] text-primary-500 leading-[1.1] header ml-[10%] mt-2 whitespace-nowrap">
                  LIGHT FOOTPRINT
                </div>
              </div>

              {/* Mobile Masked Light Blue Text */}
              <div className="absolute inset-0 z-[30] pointer-events-none whale-mask-mobile animate-float-mobile">
                <div className="absolute top-[35%] left-0 flex flex-col w-full">
                  <div className="text-[13vw] sm:text-[4rem] text-primary-100 leading-[1.1] header whitespace-nowrap transition-colors duration-700 group-hover:text-white">
                    DEEP SCALE
                  </div>
                  <div className="text-[13vw] sm:text-[4rem] text-primary-100 leading-[1.1] header ml-[10%] mt-2 whitespace-nowrap transition-colors duration-700 group-hover:text-white">
                    LIGHT FOOTPRINT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-primary-500 text-[0.9rem] md:text-[1.1rem] mt-8 lg:mt-[20px] font-bold italic inter pb-10 lg:pb-0 z-20 relative transition-opacity hover:opacity-75">
          A powerful{" "}
          <span className="text-primary-100">
            store and warehouse management
          </span>{" "}
          system built for g<span className="text-primary-100">rowing</span>{" "}
          businesses.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
