import Problems from "../../components/pages/home/problems";
import SolutionSec1 from "../../components/pages/home/solutionSec1";
import SolutionSec2 from "../../components/pages/home/solutionSec2";
import Pricing from "../../components/pages/home/pricing";
import Welcome from "../../components/pages/home/welcome";
import WhoWeAre from "../../components/pages/home/whoWeAre";

function Home() {
  return (
    <>
      <Welcome />
      <Problems />
      <SolutionSec1 />
      <WhoWeAre />
      <SolutionSec2 />
      <Pricing />
    </>
  );
}

export default Home;
