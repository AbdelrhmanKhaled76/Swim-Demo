import type { IntroductionCard as IntroductionCardType } from "../../interfaces/Cards/introduction";

const variants: Record<"primary" | "secondary", string> = {
  primary: "bg-primary-800 text-white",
  secondary: "bg-white text-primary-800 border border-gray-500",
};
function IntroductionCard(Props: IntroductionCardType) {
  return (
    <div
      className={`mx-4 p-6 md:w-full h-96 ${variants[Props.type]} flex flex-col items-center justify-center transition-transform hover:-translate-y-2 duration-300 rounded-sm`}
    >
      {Props.icon ? (
        typeof Props.icon === "string" ? (
          <img
            src={Props.icon}
            alt={`${Props.title} icon`}
            className="w-11 h-11 mb-6"
          />
        ) : (
          <div className="w-11 h-11 mb-6 flex items-center justify-center">
            {Props.icon}
          </div>
        )
      ) : null}
      <h4 className="header text-xl md:text-2xl lg:text-4xl tracking-tight header uppercase">
        {Props.title}
      </h4>
      <p className="regular text-center text-lg md:text-xl max-w-sm mx-auto mt-4 inter font-light">
        {Props.description}
      </p>
    </div>
  );
}

export default IntroductionCard;
