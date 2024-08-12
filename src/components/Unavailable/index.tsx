import { useContext } from "react";
import { appContext } from "../../AppContext";
import AnimatedDialog from "../UI/AnimatedDialog";

const Unavailable = () => {
  const { unavailable } = useContext(appContext);
  
  return (
    <AnimatedDialog noRest={true} display={unavailable} dismiss={() => null}>
      <div className="fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center">
        <div className="text-center mx-4 bg-[#1B1B1B] shadow-lg rounded-lg space-y-4 p-4">
          <h1 className="text-neutral-100 text-xl tracking-widest font-bold">
            MDS API unavailable
          </h1>
          <p className="text-neutral-300">
            Please check that your node is up & running then restart this page.
          </p>
        </div>
      </div>
    </AnimatedDialog>
  );
};

export default Unavailable;
