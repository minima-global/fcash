import FadeIn from "../../UI/Animations/FadeIn";
import { Link, useLocation } from "react-router-dom";

const Instructions = () => {
  const location = useLocation();

  return (
    <div className="mt-3">
      <FadeIn isOpen={true}>
        <ul className="w-full gap-2 p-2 rounded-lg bg-white grid grid-cols-2 flex-wrap text-base font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="mr-2">
            <Link
              to="#send"
              className={`w-full font-semibold inline-block p-3 hover:color-futurecash text-white rounded-lg ${
                location.hash === "#send"
                  ? "active hover:text-white"
                  : "passive"
              }`}
            >
              Send
            </Link>
          </li>
          <li className="mr-2">
            <Link
              to="#future"
              className={`w-full inline-block p-3 font-semibold text-white hover:color-futurecash rounded-lg ${
                location.hash === "#future"
                  ? "active hover:text-white"
                  : "passive"
              }`}
            >
              Future
            </Link>
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-4 bg-white rounded py-4 px-3">
          <h1 className="color-futurecash text-sm font-semibold">
            How to send cash to the future
          </h1>
          {location.hash === "#send" && (
            <ul className="flex flex-col gap-2">
              <li>1. Navigate to the Send page</li>
              <li>2. Select a token</li>
              <li>
                3. Pick a date and time that you would like the tokens to become
                unlocked on
              </li>
              <li>
                4. Enter a Minima wallet address. This can be your wallet
                address or the address of a third party.
              </li>
              <li>5. Choose how much tokens you'd like to send</li>
              <li>
                6. (optional) Enter a burn if you'd like to prioritize your
                transaction
              </li>
              <li>7. Then click the send button to send them to the future!</li>
            </ul>
          )}
          {location.hash === "#future" && (
            <ul className="flex flex-col gap-2">
              <li>1. Navigate to the Future page</li>
              <li>
                2. Tokens which have not reached their unlock date & time can be
                founder under the 'Pending' tab. To view more information, tap
                on the token.
              </li>
              <li>
                3. Tokens which have reacher their unlock date & time can be
                found under the 'Ready' tab.
              </li>
              <li>
                4. Once a token is ready to be collected, simply hit the collect
                button, then click the confirm button on the following screen to
                collect.
              </li>
            </ul>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default Instructions;
