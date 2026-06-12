import IntroductionCard from "../../introduction card/introductionCard";
import building from "../../../assets/icons/building-02.svg";
import date from "../../../assets/icons/date-time.svg";

function WhoWeAre() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 overflow-hidden">
      <h2 className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-primary-900 mb-10 md:mb-[60px] tracking-[1px] header transition-transform hover:scale-105 duration-500">
        Who We Are
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <IntroductionCard
          title="Story"
          description="Explore our origin, milestones, and the ideas that shaped SWIM."
          icon={
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.74074 40.3239V33.8161C7.74074 31.4852 7.13033 30.2735 5.93051 28.2477C4.49222 25.8195 3.66667 22.9855 3.66667 19.9588C3.66667 10.961 10.9628 3.66675 19.963 3.66675C28.9632 3.66675 36.2593 10.961 36.2593 19.9588C36.2593 21.0216 36.2593 21.5531 36.3037 21.851C36.4096 22.5633 36.742 23.176 37.0689 23.8101L40.3333 30.1414L37.7678 31.4238C37.0242 31.7954 36.6526 31.9813 36.3935 32.3243C36.1345 32.6671 36.0617 33.0543 35.9157 33.8286L35.9014 33.9041C35.5674 35.6778 35.1987 37.6358 34.1603 38.8711C33.7937 39.3073 33.3397 39.6617 32.8275 39.9116C31.982 40.3239 30.9425 40.3239 28.8635 40.3239C27.9015 40.3239 26.9368 40.3461 25.975 40.3228C23.6953 40.2672 22 38.3505 22 36.1248"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M26.378 19.3078C25.5964 19.3078 24.8837 19.0121 24.3437 18.5255M26.378 19.3078C26.378 21.4086 25.1609 23.404 22.8179 23.404C20.4749 23.404 19.2579 25.3993 19.2579 27.5001M26.378 19.3078C30.3184 19.3078 30.3184 13.1637 26.378 13.1637C26.0199 13.1637 25.6764 13.2258 25.3572 13.3399C25.5497 8.76009 18.9473 7.51675 17.4519 11.8071M14.6343 22.0987C14.082 22.8881 13.1696 23.404 12.1376 23.404C8.45715 23.404 8.07081 17.8352 11.6843 17.2935C9.53119 13.6274 14.0569 9.5157 17.4519 11.8071C18.541 12.5421 19.2579 13.7927 19.2579 15.2118"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          type="primary"
        />
        <IntroductionCard
          title="Mission"
          description="Streamline inventory operations and empower teams with real-time control."
          icon={building}
          type="secondary"
        />
        <IntroductionCard
          title="Values"
          description="We prioritize innovation, transparency, and reliability in every release."
          icon={
            <svg
              width="46"
              height="63"
              viewBox="0 0 46 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3375 33.5327H9.78413C4.76228 33.5327 2.25134 33.5327 1.18106 31.8749C0.110777 30.2174 1.13056 27.9078 3.17013 23.2889L9.30183 9.4026C11.1562 5.20299 12.0834 3.10317 13.8822 1.92659C15.6809 0.75 17.9638 0.75 22.53 0.75H29.6018C35.1485 0.75 37.9218 0.75 38.9677 2.56424C40.0139 4.37848 38.638 6.80214 35.886 11.6494L32.258 18.0397C30.89 20.4494 30.2059 21.6543 30.2154 22.6406C30.2279 23.9223 30.9086 25.1032 32.0082 25.7498C32.8544 26.2476 34.2329 26.2476 36.9904 26.2476C40.4762 26.2476 42.2193 26.2476 43.127 26.8519C44.3062 27.6367 44.9236 29.0411 44.7073 30.4475C44.5408 31.5299 43.3683 32.8278 41.0235 35.424L22.2893 56.166C18.6096 60.2402 16.7697 62.2772 15.5342 61.6327C14.2987 60.9878 14.892 58.3007 16.0786 52.9259L18.4031 42.398C19.3065 38.3056 19.7583 36.2594 18.6719 34.8961C17.5854 33.5327 15.5027 33.5327 11.3375 33.5327Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          }
          type="primary"
        />
        <IntroductionCard
          title="Team"
          description="A dedicated group of logistics experts and engineers building practical solutions."
          icon={date}
          type="secondary"
        />
      </div>
    </div>
  );
}

export default WhoWeAre;
