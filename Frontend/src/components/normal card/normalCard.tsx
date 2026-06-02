import type { NormalCard } from "../../interfaces/Cards/normal";

function NormalCard(props: NormalCard) {
  return (
    <div className="w-full p-6  lg:max-w-lg bg-white hover:shadow-lg  rounded-sm border border-gray-400">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-primary-500 mb-4 regular uppercase">
          {props.title}
        </h3>
        <img src={props.icon} alt="Card Icon" className="w-8 h-8 mb-4" />
      </div>
      <p className="text-primary-800 mb-6 text-2xl md:text-2xl lg:text-4xl font-bold tracking-tighter header">
        {props.value}
      </p>
      <p className="subheader font-bold py-2 text-secondary-600 regular">
        {props.subtext}
      </p>
    </div>
  );
}

export default NormalCard;
