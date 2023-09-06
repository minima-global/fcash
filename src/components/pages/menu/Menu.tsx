import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../../../AppContext";
import SlideUp from "../../UI/Animations/SlideUp";
import styles from "./Menu.module.css";
import FadeIn from "../../UI/Animations/FadeIn";
import ScaleIn from "../../UI/Animations/ScaleIn";

const Menu = () => {
  const { setDisplayMenu, displayMenu, displayBlock, setDisplayBlock, tip } =
    useContext(appContext);

  return (
    <>
      {createPortal(
        <SlideUp isOpen={displayMenu}>
          <FadeIn isOpen={displayMenu}>
            <div className={styles["backdrop"]} />
          </FadeIn>
          <div className="z-[44] absolute left-0 top-0 right-0 bottom-0 md:flex md:items-center md:justify-center">
            <div className="px-8 py-4 flex flex-col bg-base absolute bottom-[64px] left-0 right-0 md:relative md:w-[560px] md:rounded-lg">
              <h1 className="text-2xl font-bold mt-2 flex  justify-between gap-1 items-center">
                Menu
                <svg
                  onClick={() => setDisplayMenu(false)}
                  className="hover:cursor-pointer"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.23077 16.5L0 15.2692L6.76923 8.5C4.12568 5.85645 2.64355 4.37432 0 1.73077L1.23077 0.5L8 7.26923L14.7692 0.5L16 1.73077L9.23077 8.5L16 15.2692L14.7692 16.5L8 9.73077L1.23077 16.5Z"
                    fill="#08090B"
                  />
                </svg>
              </h1>
              <ul className="pb-4">
                <Link
                  to="/dashboard/instructions#send"
                  onClick={() => setDisplayMenu(false)}
                  className={`flex gap-2 items-center rounded bg-white px-4 py-3 mt-8 font-semibold text-black hover:text-white hover-state`}
                >
                  <svg
                    width="29"
                    height="29"
                    viewBox="0 0 29 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.27268 20.3391H16.4854V18.5472H8.27268V20.3391ZM8.27268 15.2323H20.3976V13.4404H8.27268V15.2323ZM8.27268 10.1255H20.3976V8.33363H8.27268V10.1255ZM5.37584 25.0875C4.89801 25.0875 4.47991 24.9083 4.12154 24.5499C3.76317 24.1916 3.58398 23.7735 3.58398 23.2956V5.37706C3.58398 4.89923 3.76317 4.48113 4.12154 4.12276C4.47991 3.76439 4.89801 3.58521 5.37584 3.58521H23.2944C23.7722 3.58521 24.1903 3.76439 24.5487 4.12276C24.9071 4.48113 25.0863 4.89923 25.0863 5.37706V23.2956C25.0863 23.7735 24.9071 24.1916 24.5487 24.5499C24.1903 24.9083 23.7722 25.0875 23.2944 25.0875H5.37584ZM5.37584 23.2956H23.2944V5.37706H5.37584V23.2956ZM5.37584 5.37706V23.2956V5.37706Z"
                      fill="#08090B"
                    />
                  </svg>
                  Instructions
                </Link>
                <Link
                  to="/dashboard/wallet"
                  onClick={() => setDisplayMenu(false)}
                  className={`flex gap-2 items-center rounded bg-white px-4 py-3 mt-2 font-semibold text-black hover:text-white hover-state`}
                >
                  <svg
                    width="29"
                    height="30"
                    viewBox="0 0 29 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2231_58645)">
                      <path
                        d="M2.38867 25.7574V23.9655H13.4385V9.51123C12.9208 9.33205 12.4579 9.03838 12.0498 8.63024C11.6416 8.22209 11.348 7.7592 11.1688 7.24155H6.42035L10.1534 16.2606C10.1335 17.1565 9.75022 17.918 9.00361 18.5452C8.25701 19.1723 7.34614 19.4859 6.27103 19.4859C5.19592 19.4859 4.28505 19.1723 3.53845 18.5452C2.79184 17.918 2.40858 17.1565 2.38867 16.2606L6.12171 7.24155H3.58324V5.44969H11.1688C11.4077 4.75286 11.8158 4.18046 12.3932 3.73249C12.9706 3.28453 13.6176 3.06055 14.3344 3.06055C15.0511 3.06055 15.6982 3.28453 16.2756 3.73249C16.8529 4.18046 17.2611 4.75286 17.5 5.44969H25.0855V7.24155H22.5471L26.2801 16.2606C26.2602 17.1565 25.8769 17.918 25.1303 18.5452C24.3837 19.1723 23.4729 19.4859 22.3977 19.4859C21.3226 19.4859 20.4118 19.1723 19.6652 18.5452C18.9186 17.918 18.5353 17.1565 18.5154 16.2606L22.2484 7.24155H17.5C17.3208 7.7592 17.0272 8.22209 16.619 8.63024C16.2109 9.03838 15.748 9.33205 15.2303 9.51123V23.9655H26.2801V25.7574H2.38867ZM20.1579 16.2008H24.6376L22.3977 10.7058L20.1579 16.2008ZM4.03121 16.2008H8.51085L6.27103 10.7058L4.03121 16.2008ZM14.3344 7.83883C14.7525 7.83883 15.1059 7.68951 15.3946 7.39087C15.6833 7.09223 15.8276 6.74381 15.8276 6.34562C15.8276 5.92752 15.6833 5.57412 15.3946 5.28544C15.1059 4.99675 14.7525 4.8524 14.3344 4.8524C13.9362 4.8524 13.5878 4.99675 13.2891 5.28544C12.9905 5.57412 12.8412 5.92752 12.8412 6.34562C12.8412 6.74381 12.9905 7.09223 13.2891 7.39087C13.5878 7.68951 13.9362 7.83883 14.3344 7.83883Z"
                        fill="#08090B"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2231_58645">
                        <rect
                          width="28.6697"
                          height="28.6697"
                          fill="white"
                          transform="translate(0 0.669678)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  Balance
                </Link>
                <div
                  // to="/dashboard/smartcontract"
                  onClick={() => {
                    setDisplayMenu(false);
                    setDisplayBlock(true);
                  }}
                  className={`flex gap-2 items-center rounded bg-white px-4 py-3 mt-2 font-semibold text-black hover:text-white hover-state`}
                >
                  <svg
                    width="29"
                    height="30"
                    viewBox="0 0 29 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.3347 1.69385L25.5756 8.18399V21.1642L14.3347 27.6544L3.09375 21.1642V8.18399L14.3347 1.69385ZM4.88561 9.2185V20.1297L14.3347 25.5853L23.7837 20.1297V9.2185L14.3347 3.76292L4.88561 9.2185Z"
                      fill="#08090B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.21394 8.25328C3.46135 7.82477 4.00929 7.67795 4.4378 7.92536L14.7828 13.8982C15.2113 14.1456 15.3581 14.6936 15.1107 15.1221C14.8633 15.5506 14.3154 15.6974 13.8868 15.45L3.54185 9.47715C3.11334 9.22974 2.96653 8.68179 3.21394 8.25328Z"
                      fill="#08090B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.3344 13.7781C14.8292 13.7781 15.2303 14.1792 15.2303 14.674V26.6197C15.2303 27.1145 14.8292 27.5156 14.3344 27.5156C13.8396 27.5156 13.4385 27.1145 13.4385 26.6197V14.674C13.4385 14.1792 13.8396 13.7781 14.3344 13.7781Z"
                      fill="#08090B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M25.4554 8.25328C25.7028 8.68179 25.556 9.22974 25.1275 9.47715L14.7825 15.45C14.354 15.6974 13.8061 15.5506 13.5587 15.1221C13.3113 14.6936 13.4581 14.1456 13.8866 13.8982L24.2316 7.92536C24.6601 7.67795 25.208 7.82477 25.4554 8.25328Z"
                      fill="#08090B"
                    />
                  </svg>
                  Current block
                </div>
                <Link
                  to="/dashboard/smartcontract"
                  onClick={() => setDisplayMenu(false)}
                  className={`flex gap-2 items-center rounded bg-white px-4 py-3 mt-2 font-semibold text-black hover:text-white hover-state`}
                >
                  <svg
                    width="29"
                    height="30"
                    viewBox="0 0 29 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.3351 25.765C11.3487 25.765 8.81024 24.7197 6.71973 22.6292C4.62923 20.5387 3.58398 18.0003 3.58398 15.0138C3.58398 12.0274 4.62923 9.48895 6.71973 7.39845C8.81024 5.30795 11.3487 4.2627 14.3351 4.2627C14.4944 4.2627 14.6636 4.26767 14.8428 4.27763C15.022 4.28758 15.251 4.30251 15.5297 4.32242C14.813 4.95953 14.2555 5.74596 13.8573 6.6817C13.4591 7.61745 13.26 8.60297 13.26 9.63827C13.26 11.4301 13.8872 12.9532 15.1415 14.2075C16.3958 15.4618 17.9188 16.089 19.7107 16.089C20.746 16.089 21.7315 15.9048 22.6673 15.5365C23.603 15.1681 24.3894 14.6555 25.0265 13.9985C25.0465 14.2374 25.0614 14.4315 25.0713 14.5808C25.0813 14.7301 25.0863 14.8745 25.0863 15.0138C25.0863 18.0003 24.041 20.5387 21.9505 22.6292C19.86 24.7197 17.3216 25.765 14.3351 25.765ZM14.3351 23.9731C16.5053 23.9731 18.3967 23.3012 20.0093 21.9573C21.622 20.6134 22.6274 19.0356 23.0256 17.2238C22.5279 17.4428 21.9953 17.6071 21.4279 17.7166C20.8605 17.8261 20.2881 17.8808 19.7107 17.8808C17.4211 17.8808 15.4749 17.0795 13.8722 15.4767C12.2695 13.874 11.4682 11.9279 11.4682 9.63827C11.4682 9.16044 11.5179 8.64777 11.6175 8.10026C11.717 7.55274 11.8962 6.93057 12.155 6.23374C10.2039 6.7713 8.58625 7.86134 7.30209 9.50388C6.01792 11.1464 5.37584 12.9831 5.37584 15.0138C5.37584 17.5025 6.24688 19.6179 7.98897 21.36C9.73105 23.1021 11.8464 23.9731 14.3351 23.9731Z"
                      fill="#08090B"
                    />
                  </svg>
                  Smart contract
                </Link>
              </ul>
            </div>
          </div>
        </SlideUp>,
        document.body
      )}

      {displayBlock &&
        createPortal(
          <ScaleIn isOpen={displayBlock}>
            <FadeIn isOpen={displayBlock}>
              <div className={styles["backdrop"]} />
            </FadeIn>
            <div
              onClick={() => setDisplayBlock(false)}
              className="z-[50] absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center"
            >
              <div className="px-4 py-3 flex flex-col bg-base  relative w-[560px] rounded-lg">
                Current block: {tip}
              </div>
            </div>
          </ScaleIn>,
          document.body
        )}
    </>
  );
};
export default Menu;
