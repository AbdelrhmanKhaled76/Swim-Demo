import NormalCard from "../../normal card/normalCard";
import databaseIcon from "../../../assets/icons/database.svg";
import cancelIcon from "../../../assets/icons/cancel-02.svg";
import visibilityIcon from "../../../assets/icons/tv-01.svg";

function Problems() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="mb-8">
        <h2 className="uppercase text-center md:text-left inline text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-primary-900 mb-10 md:mb-[60px] tracking-[1px] header transition-transform hover:scale-105 duration-500 relative z-20">
          Inventory mistakes cost businesses money.
        </h2>
        <span className="text-primary-300 ms-2 text-md inter">
          Awful thing right ?
        </span>
      </div>
      <div className="relative grid grid-cols-1 items-center md:grid-cols-2 gap-6 lg:block lg:h-[600px] mt-8 lg:mt-0">
        <div className="w-full lg:absolute lg:top-[20%] lg:left-0  lg:w-lg lg:z-0 hover:z-50 transition-all duration-300">
          <NormalCard
            title="inaccurate inventory data"
            value="Critical for decision making"
            subtext="-12% revenue loss last year"
            icon={databaseIcon}
          />
        </div>
        <div className="w-full lg:absolute lg:top-0 lg:left-[30%]  lg:w-lg lg:z-10 hover:z-50 transition-all duration-300">
          <NormalCard
            title="stock shortage"
            value="12 item"
            subtext="-1000 item last week"
            icon={databaseIcon}
          />
        </div>
        <div className="w-full lg:absolute lg:top-48 lg:left-[40%]  lg:w-lg lg:z-20 hover:z-50 transition-all duration-300">
          <NormalCard
            title="manual error tracking"
            value="2 days remaining for deadline"
            subtext="400 hours wasted"
            icon={cancelIcon}
          />
        </div>
        <div className="w-full lg:absolute lg:top-[20%] lg:right-10  lg:w-lg lg:z-0 hover:z-50 transition-all duration-300">
          <NormalCard
            title="No real-time visibility"
            value="Critical for decision making"
            subtext="+12 pending dock"
            icon={visibilityIcon}
          />
        </div>
      </div>
    </div>
  );
}

export default Problems;
