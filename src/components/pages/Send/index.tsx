import { RefObject, useContext, useRef, useState } from "react";
import Decimal from "decimal.js";

import { Formik } from "formik";
import * as yup from "yup";

import { DateTimePicker } from "@mui/x-date-pickers";

import Input from "../../UI/Input";
import { appContext } from "../../../AppContext";
import WalletSelect from "../../WalletSelect";
import AddressSelect from "../../AddressSelect";
import Button from "../../UI/Button";
import Tooltip from "../../Tooltip";
import ScaleIn from "../../UI/Animations/ScaleIn";
import {
  createFutureCashTransaction,
  getBlockTimeByDate,
} from "../../../minima/commands";
import { isDate } from "date-fns";
import { createBlockTime } from "../../../minima/rpc-commands";
import { createPortal } from "react-dom";
import Grid from "../../Grid";

import * as RPC from "../../../minima/rpc-commands";

import { format } from "date-fns";

const Send = () => {
  const { wallet, vaultLocked, tip } = useContext(appContext);
  const customStartInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [dateTimePickerConstraintsOnCliff, setDateTimePickerConstraintOnCliff] =
    useState<Date | null>(null);

  const [tooltips, setTooltips] = useState({
    datetime: false,
    burn: false,
    vault: false,
    created: false,
  });

  const [step, setStep] = useState(0);

  return (
    <Formik
      initialValues={{
        token: wallet[0],
        datetime: "",
        blocktime: undefined || "",
        address: {
          preferred: null,
          hexstring: "",
        },
        amount: "",
        burn: "",
        password: "",
      }}
      onSubmit={async (formValues, { setSubmitting, setStatus }) => {
        if (step === 0) {
          setSubmitting(false);
          return setStep(1);
        }

        if (step === 1) {
          setStatus(undefined);
          const {
            blocktime,
            address,
            amount,
            burn,
            password,
            token,
            datetime,
          } = formValues;

          const duration = new Decimal(blocktime).minus(tip);
          const scriptAddress = await RPC.getFutureCashScriptAddress();
          const stateVars = [
            { port: 1, data: blocktime },
            { port: 2, data: address.hexstring },
            { port: 3, data: datetime.valueOf() },
            { port: 4, data: duration },
          ];

          await createFutureCashTransaction(
            amount,
            scriptAddress,
            token.tokenid,
            stateVars,
            password,
            burn
          )
            .then((response: string) => {
              const actionPending = response.includes("pending");

              if (actionPending) {
                return setStep(3);
              }

              setStep(2);
            })
            .catch((err) => {
              console.error(err);
              setStatus(err);
            });
        }
      }}
      validationSchema={formValidation}
    >
      {({
        handleSubmit,
        getFieldProps,
        status,
        setStatus,
        errors,
        isValid,
        isSubmitting,
        submitForm,
        setFieldValue,
        values,
        handleBlur,
        resetForm,
        touched,
      }) => (
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="text-2xl rounded-lg w-full pb-4">
              <h1 className="text-base mb-8 mt-6">
                Lock up funds now, for yourself, or for another, to save, invest
                or secure, and unlock in the future
              </h1>
              <WalletSelect />
              <div id="date-time" className="mt-8">
                <h1 className="text-base pb-3 flex gap-1 items-center">
                  Select date and time{" "}
                  {!tooltips.datetime && (
                    <svg
                      onClick={() =>
                        setTooltips({ ...tooltips, datetime: true })
                      }
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_2226_56332"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="21"
                        height="21"
                      >
                        <rect
                          x="0.265625"
                          y="0.550781"
                          width="20"
                          height="20"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_2226_56332)">
                        <path
                          d="M10.2656 15.5508C10.5436 15.5508 10.7796 15.4534 10.9736 15.2588C11.1683 15.0648 11.2656 14.8288 11.2656 14.5508C11.2656 14.2728 11.1683 14.0368 10.9736 13.8428C10.7796 13.6481 10.5436 13.5508 10.2656 13.5508C9.98763 13.5508 9.75163 13.6481 9.55762 13.8428C9.36296 14.0368 9.26562 14.2728 9.26562 14.5508C9.26562 14.8288 9.36296 15.0648 9.55762 15.2588C9.75163 15.4534 9.98763 15.5508 10.2656 15.5508ZM9.51562 12.3628H11.0366C11.0366 11.8494 11.0816 11.4851 11.1716 11.2698C11.2623 11.0544 11.481 10.7801 11.8276 10.4468C12.3143 9.97478 12.6513 9.57211 12.8386 9.23878C13.026 8.90545 13.1196 8.53711 13.1196 8.13378C13.1196 7.37045 12.8593 6.74911 12.3386 6.26978C11.818 5.79045 11.1546 5.55078 10.3486 5.55078C9.64062 5.55078 9.02629 5.73811 8.50562 6.11278C7.98429 6.48811 7.61963 6.99511 7.41162 7.63378L8.76562 8.19678C8.89096 7.80745 9.08896 7.50545 9.35962 7.29078C9.63029 7.07545 9.94629 6.96778 10.3076 6.96778C10.6963 6.96778 11.0156 7.07878 11.2656 7.30078C11.5156 7.52278 11.6406 7.81445 11.6406 8.17578C11.6406 8.49511 11.533 8.77978 11.3176 9.02978C11.1023 9.27978 10.8626 9.52278 10.5986 9.75878C10.1126 10.2034 9.81063 10.5681 9.69263 10.8528C9.57463 11.1374 9.51562 11.6408 9.51562 12.3628ZM10.2656 18.5508C9.16829 18.5508 8.13363 18.3424 7.16162 17.9258C6.18962 17.5091 5.33896 16.9361 4.60962 16.2068C3.88029 15.4774 3.30729 14.6268 2.89062 13.6548C2.47396 12.6828 2.26562 11.6481 2.26562 10.5508C2.26562 9.43945 2.47396 8.40111 2.89062 7.43578C3.30729 6.47111 3.88029 5.62411 4.60962 4.89478C5.33896 4.16545 6.18962 3.59245 7.16162 3.17578C8.13363 2.75911 9.16829 2.55078 10.2656 2.55078C11.377 2.55078 12.4153 2.75911 13.3806 3.17578C14.3453 3.59245 15.1923 4.16545 15.9216 4.89478C16.651 5.62411 17.224 6.47111 17.6406 7.43578C18.0573 8.40111 18.2656 9.43945 18.2656 10.5508C18.2656 11.6481 18.0573 12.6828 17.6406 13.6548C17.224 14.6268 16.651 15.4774 15.9216 16.2068C15.1923 16.9361 14.3453 17.5091 13.3806 17.9258C12.4153 18.3424 11.377 18.5508 10.2656 18.5508Z"
                          fill="#282B2E"
                        />
                      </g>
                    </svg>
                  )}
                  {!!tooltips.datetime && (
                    <svg
                      className="z-2"
                      onClick={() =>
                        setTooltips({ ...tooltips, datetime: false })
                      }
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_43_3795"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                      >
                        <rect width="20" height="20" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_43_3795)">
                        <path
                          d="M7.0625 14L10 11.0625L12.9375 14L14 12.9375L11.0625 10L14 7.0625L12.9375 6L10 8.9375L7.0625 6L6 7.0625L8.9375 10L6 12.9375L7.0625 14ZM10 18C8.90278 18 7.86806 17.7917 6.89583 17.375C5.92361 16.9583 5.07292 16.3854 4.34375 15.6562C3.61458 14.9271 3.04167 14.0764 2.625 13.1042C2.20833 12.1319 2 11.0972 2 10C2 8.88889 2.20833 7.85069 2.625 6.88542C3.04167 5.92014 3.61458 5.07292 4.34375 4.34375C5.07292 3.61458 5.92361 3.04167 6.89583 2.625C7.86806 2.20833 8.90278 2 10 2C11.1111 2 12.1493 2.20833 13.1146 2.625C14.0799 3.04167 14.9271 3.61458 15.6562 4.34375C16.3854 5.07292 16.9583 5.92014 17.375 6.88542C17.7917 7.85069 18 8.88889 18 10C18 11.0972 17.7917 12.1319 17.375 13.1042C16.9583 14.0764 16.3854 14.9271 15.6562 15.6562C14.9271 16.3854 14.0799 16.9583 13.1146 17.375C12.1493 17.7917 11.1111 18 10 18Z"
                          fill="#08090B"
                        />
                      </g>
                    </svg>
                  )}
                </h1>
                <ScaleIn isOpen={tooltips.datetime}>
                  <Tooltip
                    content="Select a date & time in the future"
                    position={162}
                  />
                </ScaleIn>

                <DateTimePicker
                  open={openStartPicker}
                  disablePast={true}
                  onOpen={() => setOpenStartPicker(true)}
                  minDateTime={new Date()}
                  value={values.datetime}
                  PopperProps={{ anchorEl: customStartInputRef.current }}
                  onChange={async (value) => {
                    setFieldValue("datetime", value, true);
                    setDateTimePickerConstraintOnCliff(value);

                    if (value) {
                      const calculateBlockTime = await getBlockTimeByDate(
                        value
                      );
                      setFieldValue("blocktime", calculateBlockTime);
                    }
                  }}
                  onClose={() => setOpenStartPicker(false)}
                  renderInput={({ ref, inputProps, disabled, onChange }) => {
                    return (
                      <div ref={ref} className="divide-y divide-core-grey-150">
                        <input
                          id="start"
                          name="start"
                          className="w-full p-4 rounded-t bg-white text-base color-typing placeholder-core-grey-60 focus:outline-none"
                          onClick={() => setOpenStartPicker(true)}
                          onBlur={handleBlur}
                          value={
                            values.datetime === null
                              ? "Select date & time"
                              : values.datetime
                          }
                          onChange={onChange}
                          disabled={disabled}
                          placeholder="Select contract start"
                          ref={customStartInputRef}
                          {...inputProps}
                        />

                        <input
                          {...getFieldProps("blocktime")}
                          disabled={true}
                          placeholder="Est block: XXXXXX"
                          className="w-full bg-white p-4 rounded-b text-base color-typing placeholder-core-grey-60 focus:outline-[#3DA2FF]"
                        />

                        {touched.datetime && !!errors.datetime ? (
                          <div className="text-sm form-error-message text-left mb-4">
                            {errors.datetime}
                          </div>
                        ) : null}
                      </div>
                    );
                  }}
                />
              </div>
              <div className="mt-8">
                <h1 className="text-base pb-3">
                  How much would you like to lock?
                </h1>
                <Input
                  extraClass="pr-16 truncate"
                  formikProps={getFieldProps("amount")}
                  type="text"
                  disabled={false}
                  id="amount"
                  name="amount"
                  placeholder={`${
                    values.token &&
                    values.token.sendable &&
                    new Decimal(values.token.sendable).equals(0)
                      ? `Max ${new Decimal(values.token.sendable)}`
                      : "Add amount"
                  }`}
                  endIcon={
                    <div
                      onClick={() =>
                        setFieldValue("amount", values.token.sendable)
                      }
                      className="hover:cursor-pointer m-auto text-base color-core-black-2 font-semibold"
                    >
                      Max
                    </div>
                  }
                  error={
                    touched.amount && !!errors.amount ? errors.amount : false
                  }
                />
              </div>
              <div className="mt-8">
                <h1 className="text-base pb-3">Select wallet</h1>
                <AddressSelect />
              </div>

              {values.address.preferred && (
                <div className="mt-8">
                  <h1 className="text-base pb-3">Wallet address</h1>
                  <Input
                    formikProps={getFieldProps("address.hexstring")}
                    id="address.hexstring"
                    name="address.hexstring"
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Add address"
                    error={
                      errors.address && errors.address.hexstring
                        ? errors.address.hexstring
                        : false
                    }
                  />
                </div>
              )}

              <div className="mt-8">
                <h1 className="text-base pb-3 flex gap-1 items-center">
                  Burn{" "}
                  {!tooltips.burn && (
                    <svg
                      onClick={() => setTooltips({ ...tooltips, burn: true })}
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_2226_56332"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="21"
                        height="21"
                      >
                        <rect
                          x="0.265625"
                          y="0.550781"
                          width="20"
                          height="20"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_2226_56332)">
                        <path
                          d="M10.2656 15.5508C10.5436 15.5508 10.7796 15.4534 10.9736 15.2588C11.1683 15.0648 11.2656 14.8288 11.2656 14.5508C11.2656 14.2728 11.1683 14.0368 10.9736 13.8428C10.7796 13.6481 10.5436 13.5508 10.2656 13.5508C9.98763 13.5508 9.75163 13.6481 9.55762 13.8428C9.36296 14.0368 9.26562 14.2728 9.26562 14.5508C9.26562 14.8288 9.36296 15.0648 9.55762 15.2588C9.75163 15.4534 9.98763 15.5508 10.2656 15.5508ZM9.51562 12.3628H11.0366C11.0366 11.8494 11.0816 11.4851 11.1716 11.2698C11.2623 11.0544 11.481 10.7801 11.8276 10.4468C12.3143 9.97478 12.6513 9.57211 12.8386 9.23878C13.026 8.90545 13.1196 8.53711 13.1196 8.13378C13.1196 7.37045 12.8593 6.74911 12.3386 6.26978C11.818 5.79045 11.1546 5.55078 10.3486 5.55078C9.64062 5.55078 9.02629 5.73811 8.50562 6.11278C7.98429 6.48811 7.61963 6.99511 7.41162 7.63378L8.76562 8.19678C8.89096 7.80745 9.08896 7.50545 9.35962 7.29078C9.63029 7.07545 9.94629 6.96778 10.3076 6.96778C10.6963 6.96778 11.0156 7.07878 11.2656 7.30078C11.5156 7.52278 11.6406 7.81445 11.6406 8.17578C11.6406 8.49511 11.533 8.77978 11.3176 9.02978C11.1023 9.27978 10.8626 9.52278 10.5986 9.75878C10.1126 10.2034 9.81063 10.5681 9.69263 10.8528C9.57463 11.1374 9.51562 11.6408 9.51562 12.3628ZM10.2656 18.5508C9.16829 18.5508 8.13363 18.3424 7.16162 17.9258C6.18962 17.5091 5.33896 16.9361 4.60962 16.2068C3.88029 15.4774 3.30729 14.6268 2.89062 13.6548C2.47396 12.6828 2.26562 11.6481 2.26562 10.5508C2.26562 9.43945 2.47396 8.40111 2.89062 7.43578C3.30729 6.47111 3.88029 5.62411 4.60962 4.89478C5.33896 4.16545 6.18962 3.59245 7.16162 3.17578C8.13363 2.75911 9.16829 2.55078 10.2656 2.55078C11.377 2.55078 12.4153 2.75911 13.3806 3.17578C14.3453 3.59245 15.1923 4.16545 15.9216 4.89478C16.651 5.62411 17.224 6.47111 17.6406 7.43578C18.0573 8.40111 18.2656 9.43945 18.2656 10.5508C18.2656 11.6481 18.0573 12.6828 17.6406 13.6548C17.224 14.6268 16.651 15.4774 15.9216 16.2068C15.1923 16.9361 14.3453 17.5091 13.3806 17.9258C12.4153 18.3424 11.377 18.5508 10.2656 18.5508Z"
                          fill="#282B2E"
                        />
                      </g>
                    </svg>
                  )}
                  {!!tooltips.burn && (
                    <svg
                      onClick={() => setTooltips({ ...tooltips, burn: false })}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_43_3795"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                      >
                        <rect width="20" height="20" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_43_3795)">
                        <path
                          d="M7.0625 14L10 11.0625L12.9375 14L14 12.9375L11.0625 10L14 7.0625L12.9375 6L10 8.9375L7.0625 6L6 7.0625L8.9375 10L6 12.9375L7.0625 14ZM10 18C8.90278 18 7.86806 17.7917 6.89583 17.375C5.92361 16.9583 5.07292 16.3854 4.34375 15.6562C3.61458 14.9271 3.04167 14.0764 2.625 13.1042C2.20833 12.1319 2 11.0972 2 10C2 8.88889 2.20833 7.85069 2.625 6.88542C3.04167 5.92014 3.61458 5.07292 4.34375 4.34375C5.07292 3.61458 5.92361 3.04167 6.89583 2.625C7.86806 2.20833 8.90278 2 10 2C11.1111 2 12.1493 2.20833 13.1146 2.625C14.0799 3.04167 14.9271 3.61458 15.6562 4.34375C16.3854 5.07292 16.9583 5.92014 17.375 6.88542C17.7917 7.85069 18 8.88889 18 10C18 11.0972 17.7917 12.1319 17.375 13.1042C16.9583 14.0764 16.3854 14.9271 15.6562 15.6562C14.9271 16.3854 14.0799 16.9583 13.1146 17.375C12.1493 17.7917 11.1111 18 10 18Z"
                          fill="#08090B"
                        />
                      </g>
                    </svg>
                  )}
                </h1>
                <ScaleIn isOpen={tooltips.burn}>
                  <Tooltip
                    content="(optional) A burn is denominated in MINIMA and will priortize your transaction"
                    position={38}
                  />
                </ScaleIn>
                <Input
                  formikProps={getFieldProps("burn")}
                  id="burn"
                  name="burn"
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Add amount"
                  error={errors.burn ? errors.burn : false}
                />
              </div>

              {!!vaultLocked && (
                <div className="mt-8">
                  <h1 className="text-base pb-3 flex items-center gap-1">
                    Vault password{" "}
                    {!tooltips.vault && (
                      <svg
                        onClick={() =>
                          setTooltips({ ...tooltips, vault: true })
                        }
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_2226_56332"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="21"
                          height="21"
                        >
                          <rect
                            x="0.265625"
                            y="0.550781"
                            width="20"
                            height="20"
                            fill="#D9D9D9"
                          />
                        </mask>
                        <g mask="url(#mask0_2226_56332)">
                          <path
                            d="M10.2656 15.5508C10.5436 15.5508 10.7796 15.4534 10.9736 15.2588C11.1683 15.0648 11.2656 14.8288 11.2656 14.5508C11.2656 14.2728 11.1683 14.0368 10.9736 13.8428C10.7796 13.6481 10.5436 13.5508 10.2656 13.5508C9.98763 13.5508 9.75163 13.6481 9.55762 13.8428C9.36296 14.0368 9.26562 14.2728 9.26562 14.5508C9.26562 14.8288 9.36296 15.0648 9.55762 15.2588C9.75163 15.4534 9.98763 15.5508 10.2656 15.5508ZM9.51562 12.3628H11.0366C11.0366 11.8494 11.0816 11.4851 11.1716 11.2698C11.2623 11.0544 11.481 10.7801 11.8276 10.4468C12.3143 9.97478 12.6513 9.57211 12.8386 9.23878C13.026 8.90545 13.1196 8.53711 13.1196 8.13378C13.1196 7.37045 12.8593 6.74911 12.3386 6.26978C11.818 5.79045 11.1546 5.55078 10.3486 5.55078C9.64062 5.55078 9.02629 5.73811 8.50562 6.11278C7.98429 6.48811 7.61963 6.99511 7.41162 7.63378L8.76562 8.19678C8.89096 7.80745 9.08896 7.50545 9.35962 7.29078C9.63029 7.07545 9.94629 6.96778 10.3076 6.96778C10.6963 6.96778 11.0156 7.07878 11.2656 7.30078C11.5156 7.52278 11.6406 7.81445 11.6406 8.17578C11.6406 8.49511 11.533 8.77978 11.3176 9.02978C11.1023 9.27978 10.8626 9.52278 10.5986 9.75878C10.1126 10.2034 9.81063 10.5681 9.69263 10.8528C9.57463 11.1374 9.51562 11.6408 9.51562 12.3628ZM10.2656 18.5508C9.16829 18.5508 8.13363 18.3424 7.16162 17.9258C6.18962 17.5091 5.33896 16.9361 4.60962 16.2068C3.88029 15.4774 3.30729 14.6268 2.89062 13.6548C2.47396 12.6828 2.26562 11.6481 2.26562 10.5508C2.26562 9.43945 2.47396 8.40111 2.89062 7.43578C3.30729 6.47111 3.88029 5.62411 4.60962 4.89478C5.33896 4.16545 6.18962 3.59245 7.16162 3.17578C8.13363 2.75911 9.16829 2.55078 10.2656 2.55078C11.377 2.55078 12.4153 2.75911 13.3806 3.17578C14.3453 3.59245 15.1923 4.16545 15.9216 4.89478C16.651 5.62411 17.224 6.47111 17.6406 7.43578C18.0573 8.40111 18.2656 9.43945 18.2656 10.5508C18.2656 11.6481 18.0573 12.6828 17.6406 13.6548C17.224 14.6268 16.651 15.4774 15.9216 16.2068C15.1923 16.9361 14.3453 17.5091 13.3806 17.9258C12.4153 18.3424 11.377 18.5508 10.2656 18.5508Z"
                            fill="#282B2E"
                          />
                        </g>
                      </svg>
                    )}
                    {!!tooltips.vault && (
                      <svg
                        onClick={() =>
                          setTooltips({ ...tooltips, vault: false })
                        }
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_43_3795"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="20"
                          height="20"
                        >
                          <rect width="20" height="20" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_43_3795)">
                          <path
                            d="M7.0625 14L10 11.0625L12.9375 14L14 12.9375L11.0625 10L14 7.0625L12.9375 6L10 8.9375L7.0625 6L6 7.0625L8.9375 10L6 12.9375L7.0625 14ZM10 18C8.90278 18 7.86806 17.7917 6.89583 17.375C5.92361 16.9583 5.07292 16.3854 4.34375 15.6562C3.61458 14.9271 3.04167 14.0764 2.625 13.1042C2.20833 12.1319 2 11.0972 2 10C2 8.88889 2.20833 7.85069 2.625 6.88542C3.04167 5.92014 3.61458 5.07292 4.34375 4.34375C5.07292 3.61458 5.92361 3.04167 6.89583 2.625C7.86806 2.20833 8.90278 2 10 2C11.1111 2 12.1493 2.20833 13.1146 2.625C14.0799 3.04167 14.9271 3.61458 15.6562 4.34375C16.3854 5.07292 16.9583 5.92014 17.375 6.88542C17.7917 7.85069 18 8.88889 18 10C18 11.0972 17.7917 12.1319 17.375 13.1042C16.9583 14.0764 16.3854 14.9271 15.6562 15.6562C14.9271 16.3854 14.0799 16.9583 13.1146 17.375C12.1493 17.7917 11.1111 18 10 18Z"
                            fill="#08090B"
                          />
                        </g>
                      </svg>
                    )}
                  </h1>
                  <ScaleIn isOpen={tooltips.vault}>
                    <Tooltip
                      content="Your vault password is required to post this transaction"
                      position={120}
                    />
                  </ScaleIn>
                  <Input
                    formikProps={getFieldProps("password")}
                    id="password"
                    name="password"
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Enter password"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                extraClass="mt-6"
              >
                Send funds
              </Button>

              <div className="flex items-center justify-center">
                <button
                  disabled={isSubmitting}
                  onClick={() => {
                    resetForm();
                    setFieldValue("token", wallet[0]);
                  }}
                  className="mt-6 bg-transparent text-base text-center border-black border-b-2 border-y-0 border-x-0 rounded-none pb-0 px-0 pt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {step === 1 &&
            createPortal(
              <div className="z-50 bg-base absolute top-0 left-0 right-0 bottom-0 h-full">
                <Grid
                  fullHeight={true}
                  header={<div />}
                  content={
                    <div className="flex flex-col">
                      <h1 className="text-black text-2xl mb-4">
                        Confirm transaction
                      </h1>
                      <div className="bg-white rounded px-4 py-4">
                        <ul className="break-all flex flex-col gap-6">
                          <li>
                            <h3 className="color-core-black-3 text-lg">
                              Token
                            </h3>
                            <p className="text-black">
                              {values.token.tokenid === "0x00"
                                ? "Minima"
                                : values.token.token.name
                                ? values.token.token.name
                                : "Unavailable"}
                            </p>
                          </li>
                          <li>
                            <h3 className="color-core-black-3 text-lg">
                              Amount
                            </h3>
                            <p className="text-black">{values.amount}</p>
                          </li>
                          {values.burn && (
                            <li>
                              <h3 className="color-core-black-3 text-lg">
                                Burn
                              </h3>
                              <p className="text-black">{values.burn}</p>
                            </li>
                          )}
                          <li>
                            <h3 className="color-core-black-3 text-lg">
                              Recipient address
                            </h3>
                            <p className="text-black">
                              {values.address.hexstring}
                            </p>
                          </li>
                          <li>
                            <h3
                              className={`color-core-black-3 flex gap-1 items-center text-lg ${
                                tooltips.created ? "mb-3" : ""
                              }`}
                            >
                              Date and time created
                              {!tooltips.created && (
                                <svg
                                  onClick={() =>
                                    setTooltips({ ...tooltips, created: true })
                                  }
                                  width="21"
                                  height="21"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <mask
                                    id="mask0_2226_56332"
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="21"
                                    height="21"
                                  >
                                    <rect
                                      x="0.265625"
                                      y="0.550781"
                                      width="20"
                                      height="20"
                                      fill="#D9D9D9"
                                    />
                                  </mask>
                                  <g mask="url(#mask0_2226_56332)">
                                    <path
                                      d="M10.2656 15.5508C10.5436 15.5508 10.7796 15.4534 10.9736 15.2588C11.1683 15.0648 11.2656 14.8288 11.2656 14.5508C11.2656 14.2728 11.1683 14.0368 10.9736 13.8428C10.7796 13.6481 10.5436 13.5508 10.2656 13.5508C9.98763 13.5508 9.75163 13.6481 9.55762 13.8428C9.36296 14.0368 9.26562 14.2728 9.26562 14.5508C9.26562 14.8288 9.36296 15.0648 9.55762 15.2588C9.75163 15.4534 9.98763 15.5508 10.2656 15.5508ZM9.51562 12.3628H11.0366C11.0366 11.8494 11.0816 11.4851 11.1716 11.2698C11.2623 11.0544 11.481 10.7801 11.8276 10.4468C12.3143 9.97478 12.6513 9.57211 12.8386 9.23878C13.026 8.90545 13.1196 8.53711 13.1196 8.13378C13.1196 7.37045 12.8593 6.74911 12.3386 6.26978C11.818 5.79045 11.1546 5.55078 10.3486 5.55078C9.64062 5.55078 9.02629 5.73811 8.50562 6.11278C7.98429 6.48811 7.61963 6.99511 7.41162 7.63378L8.76562 8.19678C8.89096 7.80745 9.08896 7.50545 9.35962 7.29078C9.63029 7.07545 9.94629 6.96778 10.3076 6.96778C10.6963 6.96778 11.0156 7.07878 11.2656 7.30078C11.5156 7.52278 11.6406 7.81445 11.6406 8.17578C11.6406 8.49511 11.533 8.77978 11.3176 9.02978C11.1023 9.27978 10.8626 9.52278 10.5986 9.75878C10.1126 10.2034 9.81063 10.5681 9.69263 10.8528C9.57463 11.1374 9.51562 11.6408 9.51562 12.3628ZM10.2656 18.5508C9.16829 18.5508 8.13363 18.3424 7.16162 17.9258C6.18962 17.5091 5.33896 16.9361 4.60962 16.2068C3.88029 15.4774 3.30729 14.6268 2.89062 13.6548C2.47396 12.6828 2.26562 11.6481 2.26562 10.5508C2.26562 9.43945 2.47396 8.40111 2.89062 7.43578C3.30729 6.47111 3.88029 5.62411 4.60962 4.89478C5.33896 4.16545 6.18962 3.59245 7.16162 3.17578C8.13363 2.75911 9.16829 2.55078 10.2656 2.55078C11.377 2.55078 12.4153 2.75911 13.3806 3.17578C14.3453 3.59245 15.1923 4.16545 15.9216 4.89478C16.651 5.62411 17.224 6.47111 17.6406 7.43578C18.0573 8.40111 18.2656 9.43945 18.2656 10.5508C18.2656 11.6481 18.0573 12.6828 17.6406 13.6548C17.224 14.6268 16.651 15.4774 15.9216 16.2068C15.1923 16.9361 14.3453 17.5091 13.3806 17.9258C12.4153 18.3424 11.377 18.5508 10.2656 18.5508Z"
                                      fill="#282B2E"
                                    />
                                  </g>
                                </svg>
                              )}
                              {!!tooltips.created && (
                                <svg
                                  className="z-2"
                                  onClick={() =>
                                    setTooltips({
                                      ...tooltips,
                                      created: false,
                                    })
                                  }
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <mask
                                    id="mask0_43_3795"
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="20"
                                    height="20"
                                  >
                                    <rect
                                      width="20"
                                      height="20"
                                      fill="#D9D9D9"
                                    />
                                  </mask>
                                  <g mask="url(#mask0_43_3795)">
                                    <path
                                      d="M7.0625 14L10 11.0625L12.9375 14L14 12.9375L11.0625 10L14 7.0625L12.9375 6L10 8.9375L7.0625 6L6 7.0625L8.9375 10L6 12.9375L7.0625 14ZM10 18C8.90278 18 7.86806 17.7917 6.89583 17.375C5.92361 16.9583 5.07292 16.3854 4.34375 15.6562C3.61458 14.9271 3.04167 14.0764 2.625 13.1042C2.20833 12.1319 2 11.0972 2 10C2 8.88889 2.20833 7.85069 2.625 6.88542C3.04167 5.92014 3.61458 5.07292 4.34375 4.34375C5.07292 3.61458 5.92361 3.04167 6.89583 2.625C7.86806 2.20833 8.90278 2 10 2C11.1111 2 12.1493 2.20833 13.1146 2.625C14.0799 3.04167 14.9271 3.61458 15.6562 4.34375C16.3854 5.07292 16.9583 5.92014 17.375 6.88542C17.7917 7.85069 18 8.88889 18 10C18 11.0972 17.7917 12.1319 17.375 13.1042C16.9583 14.0764 16.3854 14.9271 15.6562 15.6562C14.9271 16.3854 14.0799 16.9583 13.1146 17.375C12.1493 17.7917 11.1111 18 10 18Z"
                                      fill="#08090B"
                                    />
                                  </g>
                                </svg>
                              )}
                            </h3>
                            <ScaleIn isOpen={tooltips.created}>
                              <Tooltip
                                content="The created timestamp will change according to when this transaction is posted to the network"
                                position={195}
                              />
                            </ScaleIn>
                            <p className="text-black">
                              {format(new Date(), "MMM d yyyy - hh:mm:ss a")}
                            </p>
                          </li>
                          <li>
                            <h3 className="color-core-black-3 text-lg">
                              Date and time unlocked
                            </h3>
                            <p className="text-black">
                              {format(
                                new Date(values.datetime).getTime(),
                                "MMM d yyyy - hh:mm:ss a"
                              )}
                            </p>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-6">
                        <h4 className="color-core-grey">TIPS</h4>
                        <p className="mt-2 text-sm">
                          Double-check that all details are correct before you
                          confirm this transaction. Once you have pressed
                          confirm, recipient will not be able to access funds
                          until the date and time set to unlock.
                        </p>
                      </div>

                      <Button
                        onClick={() => submitForm()}
                        disabled={isSubmitting}
                        extraClass="mt-6"
                      >
                        Confirm
                      </Button>

                      {!isSubmitting && (
                        <div className="flex items-center justify-center">
                          <button
                            disabled={isSubmitting}
                            onClick={() => {
                              setStep(0);
                            }}
                            className="hover:cursor-pointer hover:opacity-50 mt-4 bg-transparent text-base text-center border-black border-b-2 border-y-0 border-x-0 rounded-none pb-0 px-0 pt-0"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  }
                />
              </div>,
              document.body
            )}
          {step === 2 &&
            createPortal(
              <div className="z-50 bg-base absolute top-0 left-0 right-0 bottom-0 h-full">
                <Grid
                  header={<div />}
                  content={
                    <div className="flex flex-col text-center items-center">
                      <svg
                        width="290"
                        height="190"
                        viewBox="0 0 290 190"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M139.333 86.4502H118.644V95.3003H139.333V86.4502Z"
                          fill="black"
                        />
                        <path
                          d="M134.042 57.8594C134.042 57.8594 114.556 67.7396 125.787 84.8743C125.787 84.8743 136.325 91.5326 132.18 102.745C128.035 113.958 135.135 126.35 144.593 131.676C144.593 131.676 151.688 139.347 148.14 151.151C144.593 162.956 148.259 161.343 148.259 161.343H195.033L149.901 87.9909L152.856 75.599L134.042 57.8594Z"
                          fill="black"
                        />
                        <path
                          d="M187.24 149.429L201.088 94.2548L151.469 80.7539L144.588 83.9582L187.24 149.429Z"
                          fill="black"
                        />
                        <path
                          d="M177.931 10.488C177.342 10.3786 176.741 10.3491 176.144 10.4004C176.864 7.71773 177.382 3.92609 176.46 1.77822C175.086 -1.43043 162.704 -0.0540423 158.577 5.43836C155.249 9.87874 167.991 12.2107 173.075 12.9471C172.434 16.204 168.54 15.3229 167.337 17.1245C166.134 18.9261 166.731 19.8466 167.337 21.9462C167.943 24.0459 166.125 23.4541 164.614 24.6639C163.104 25.8738 161.133 27.5351 163.855 28.7449L178.989 31.4626C179.287 30.9134 179.499 30.3222 179.617 29.7092C179.718 29.7399 179.815 29.7706 179.916 29.7925C180.316 29.9025 180.727 29.9687 181.141 29.9898H181.339C182.373 30.0064 183.372 29.6177 184.122 28.9071C186.647 26.5663 186.511 22.2618 186.054 19.36H188.689C188.689 19.36 192.311 10.0322 177.931 10.488ZM183.227 27.9822C182.684 28.5022 181.949 28.7723 181.198 28.7274C180.654 28.6955 180.119 28.5771 179.613 28.3767C179.505 27.8859 179.234 27.4458 178.845 27.1274C177.027 25.6151 175.516 24.4053 176.724 23.1824C177.931 21.9594 177.633 20.4647 176.724 19.2373L176.684 19.2154C176.482 18.9185 176.517 18.52 176.769 18.2632C177.021 18.0065 177.419 17.9629 177.721 18.159L179.587 19.3995H184.706C185.154 22.0339 185.369 25.9965 183.227 27.9822Z"
                          fill="black"
                        />
                        <path
                          d="M285.947 126.916C283.448 117.408 277.943 110.666 270.439 107.927C262.935 105.187 254.373 106.796 246.321 112.45C244.763 113.548 243.281 114.751 241.886 116.049L229.842 82.3846C227.512 75.9089 221.954 71.1252 215.195 69.778C214.363 69.6115 213.521 69.5002 212.675 69.4448L213.417 69.7692L212.512 70.7555C213.061 70.7861 213.606 70.8431 214.141 70.9264C220.781 71.9495 226.328 76.5156 228.6 82.8273L236.477 104.845L236.2 104.683L202.914 160.668H128.22C128.633 159.699 129.028 158.704 129.397 157.696C134.358 144.147 133.95 130.422 129.269 120.625L132.716 116.417L131.697 115.584L128.624 119.341C125.757 113.998 121.537 109.974 116.167 108.01C100.879 102.434 81.9463 115.641 73.9553 137.462C70.7281 146.277 69.7753 155.171 70.794 163.008C72.2956 174.563 78.0825 183.821 87.1888 187.148C87.9388 187.42 88.7041 187.649 89.4808 187.832C89.9198 187.946 90.3589 188.038 90.8287 188.112C92.0425 188.321 93.272 188.425 94.5037 188.423C96.2767 188.42 98.0437 188.22 99.7726 187.827C104.857 186.692 109.924 183.97 114.517 179.972C119.715 175.453 124.312 169.303 127.645 162H203.665L236.911 106.077L240.863 117.057C235.379 122.453 230.901 129.541 227.95 137.602C224.174 147.916 223.485 158.336 225.412 167.068C227.546 176.742 232.876 184.342 240.78 187.455L241.03 187.551L241.28 187.643C242.739 188.166 244.252 188.527 245.789 188.722C246.729 188.841 247.675 188.901 248.621 188.901C249.649 188.9 250.676 188.831 251.695 188.695C253.56 188.451 255.394 188.011 257.166 187.38C268.037 183.527 278.382 172.696 283.773 157.968C287.65 147.36 288.427 136.331 285.947 126.916ZM128.356 121.743C132.641 131.172 132.905 144.287 128.158 157.249C127.719 158.415 127.28 159.559 126.784 160.672H96.4488L128.356 121.743ZM87.6367 185.916C73.0332 180.586 67.4395 159.055 75.1891 137.918C81.7444 120.012 95.7902 108.067 108.813 108.067C111.165 108.06 113.501 108.468 115.711 109.272C120.936 111.179 125.006 115.159 127.728 120.454L93.6695 161.983H126.191C117.638 180.262 101.116 190.834 87.6367 185.916ZM282.531 157.512C276.432 174.169 263.892 185.732 251.677 187.398C250.677 187.537 249.667 187.608 248.657 187.608C247.721 187.609 246.787 187.546 245.86 187.42C244.442 187.227 243.05 186.883 241.706 186.394C226.993 181.024 221.368 159.331 229.166 138.041C231.968 130.378 236.191 123.619 241.329 118.412L250.711 144.642L251.954 144.204L242.365 117.399C243.839 115.995 245.415 114.701 247.08 113.529C252.349 109.833 257.807 107.944 263.005 107.944C265.386 107.938 267.749 108.35 269.987 109.163C277.073 111.749 282.281 118.171 284.673 127.249C287.084 136.41 286.324 147.158 282.531 157.512Z"
                          fill="black"
                        />
                        <path
                          d="M206.475 72.237L205.158 71.3604V83.0421H206.475V72.237Z"
                          fill="black"
                        />
                        <path
                          d="M232.639 94.395H201.026V95.71H232.639V94.395Z"
                          fill="black"
                        />
                        <path
                          d="M189.795 167.629L185.584 162.829L179.319 165.52L177.562 161.987L176.904 160.672L176.662 160.19L169.417 160.668L167.191 160.817L167.385 161.325L167.63 161.983L172.153 174.011L177.123 172.779L175.973 169.711L178.985 170.714L189.795 167.629ZM175.367 171.859L172.987 172.455L169.057 162.013L169.448 161.987L175.85 161.549L176.065 161.987L178.699 167.217L185.25 164.411L187.446 166.936L179.011 169.342L173.769 167.589L175.367 171.859Z"
                          fill="black"
                        />
                        <path
                          d="M191.286 167.801L168.01 176.203L169.415 180.08L192.691 171.678L191.286 167.801Z"
                          fill="black"
                        />
                        <path
                          d="M119.37 63.6105H77.6367V64.9255H119.37V63.6105Z"
                          fill="black"
                        />
                        <path
                          d="M113.403 77.804H89.5576V79.119H113.403V77.804Z"
                          fill="black"
                        />
                        <path
                          d="M110.194 96.578H73.9663V97.893H110.194V96.578Z"
                          fill="black"
                        />
                        <path
                          d="M184.609 50.5831L179.854 29.5428L178.568 29.8321L183.446 51.3853L204.126 64.404L199.415 69.9314L174.489 61.0244L170.976 46.6994L168.627 37.1305L167.345 37.4461L169.54 46.3531C157.971 61.4145 137.603 55.1681 133.256 53.6077L168.381 27.7456L167.6 26.6848L130.301 54.1468L154.243 78.5317L172.61 58.8502L173.395 62.0545L199.841 71.4832L206.102 64.1191L184.609 50.5831ZM154.204 76.5942L132.97 54.9709C137.256 56.4851 141.738 57.371 146.279 57.6009C146.864 57.6272 147.449 57.6404 148.035 57.6404C157.176 57.6404 164.689 54.3353 169.931 47.9969L172.21 57.2853L154.204 76.5942Z"
                          fill="black"
                        />
                        <path
                          d="M231.691 78.6981L239.058 98.8092H266.988L276.353 79.6581L231.691 78.6981ZM250.725 80.4252L250.422 80.6619L252.34 83.1078L244.147 89.5514L238.786 80.1666L250.725 80.4252ZM255.348 97.4941H247.317L248.345 96.9068L244.806 90.7086L253.148 84.1335L259.55 92.2867L255.08 97.2618L255.348 97.4941ZM260.375 93.3255L263.651 97.4941H256.626L260.375 93.3255ZM233.592 80.057L238.259 80.1578L237.513 80.5961L243.102 90.3886L239.116 93.5272L239.932 94.5573L243.765 91.5459L247.168 97.5073H239.981L233.592 80.057ZM266.167 97.4941H263.971L264.823 96.8279L261.289 92.3305L267.984 84.8349L267.001 83.9582L260.441 91.2653L254.189 83.3095L255.067 82.6256L254.255 81.5912L253.377 82.275L251.928 80.4339L274.246 80.9117L266.167 97.4941Z"
                          fill="black"
                        />
                        <path
                          d="M154.643 12.465C142.779 0.623646 123.548 0.623646 111.684 12.465L100.141 23.989L133.427 57.2195L134.358 56.2902L109.234 31.2084L125.607 18.2073C129.51 15.1188 130.342 9.53603 127.508 5.44718C129.374 5.08116 131.271 4.89765 133.172 4.89925C140.879 4.87755 148.274 7.9331 153.712 13.3855L167.551 27.2108L168.482 26.2815L154.643 12.465ZM127.82 11.6322C127.604 13.8124 126.509 15.8109 124.786 17.1684L108.299 30.2704L102.003 23.989L112.615 13.3855C116.327 9.66564 120.987 7.02841 126.09 5.7584C127.418 7.41322 128.039 9.52334 127.82 11.6322Z"
                          fill="black"
                        />
                        <path
                          d="M176.166 98.1908L164.909 114.078L165.989 114.84L177.246 98.953L176.166 98.1908Z"
                          fill="white"
                        />
                        <path
                          d="M199.841 96.2887C183.534 96.1134 158.775 95.9556 157.405 96.2493C157.504 96.2232 157.593 96.1701 157.664 96.0958L156.733 95.1666C157.023 94.8773 157.216 94.6844 178.686 94.8027C189.171 94.8597 199.762 94.9737 199.845 94.9737L199.841 96.2887Z"
                          fill="white"
                        />
                        <path
                          d="M187.556 150.454L148.988 89.5251L153.585 85.957L154.393 86.9959L150.74 89.832L188.671 149.753L187.556 150.454Z"
                          fill="white"
                        />
                        <path
                          d="M131.965 110.215L131.526 108.974C137.607 106.866 141.783 103.324 142.437 99.7385C142.757 97.9237 142.094 96.2843 140.518 94.9956C134.841 90.358 138.279 80.0921 140.83 75.8358C141.07 75.4384 141.11 74.9523 140.94 74.5208C139.842 71.014 130.31 66.1178 126.727 64.5222L127.267 63.3212C127.816 63.5666 140.698 69.3659 142.195 74.1263C142.475 74.9104 142.39 75.7784 141.963 76.4933C139.039 81.3545 136.83 90.2615 141.352 93.9611C143.293 95.5435 144.136 97.6739 143.732 99.9532C142.995 104.025 138.485 107.949 131.965 110.215Z"
                          fill="white"
                        />
                        <path
                          d="M150.371 142.696L149.809 141.508C149.888 141.473 157.493 137.87 160.114 134.38C160.545 133.904 160.669 133.225 160.434 132.627C159.591 130.484 154.687 128.406 150.432 127.63C149.743 127.507 148.808 127.253 148.597 126.473C148.338 125.513 149.365 124.645 150.792 123.439C152.72 121.804 155.117 119.771 154.511 117.544C154.42 117.214 154.175 116.95 153.853 116.834C150.7 115.519 140.053 120.84 136.215 123.001L135.57 121.857C137.036 121.029 150.059 113.822 154.358 115.619C155.063 115.894 155.595 116.488 155.789 117.219C156.619 120.253 153.752 122.686 151.657 124.461C150.994 125.022 150.107 125.776 149.923 126.135C150.164 126.249 150.422 126.325 150.687 126.359C154.454 127.043 160.491 129.155 161.664 132.167C162.063 133.186 161.874 134.342 161.172 135.183C158.349 138.922 150.696 142.547 150.371 142.696Z"
                          fill="white"
                        />
                        <path
                          d="M190.497 161.873C190.436 161.777 184.429 152.195 180.065 150.016C178.792 149.38 178.471 149.486 178.458 149.494C178.269 149.806 178.735 151.603 179.073 152.918C179.492 154.45 179.832 156.002 180.091 157.569C180.223 158.445 180.285 159.462 179.551 159.879C178.559 160.44 177.242 159.348 174.616 157.178C171.644 154.728 167.591 151.366 163.2 150.055C161.418 149.525 160.127 149.652 159.354 150.437C157.361 152.462 158.735 158.511 159.433 160.672L158.178 161.075C158.063 160.729 155.46 152.523 158.41 149.516C159.552 148.355 161.291 148.114 163.578 148.797C168.21 150.183 172.399 153.641 175.455 156.166C176.706 157.2 178.234 158.463 178.849 158.673C178.866 158.371 178.847 158.068 178.792 157.77C178.536 156.247 178.203 154.737 177.795 153.247C177.141 150.713 176.75 149.188 177.65 148.46C178.405 147.851 179.591 148.311 180.653 148.841C185.352 151.186 191.362 160.773 191.63 161.181L190.497 161.873Z"
                          fill="white"
                        />
                        <path
                          d="M190.511 135.134C189.193 134.188 177.672 125.772 178.274 121.52C178.366 120.871 178.765 119.999 180.135 119.508C180.956 119.214 181.83 118.916 182.73 118.609C186.638 117.294 192.539 115.264 192.776 113.612C192.838 113.174 192.337 112.735 191.898 112.424C189.527 110.767 188.456 108.361 189.163 106.287C189.602 105.047 191.323 102.198 198.269 102.526L198.203 103.841C194.006 103.644 191.09 104.718 190.41 106.717C189.896 108.216 190.774 110.035 192.653 111.346C193.72 112.091 194.194 112.915 194.071 113.796C193.747 116.08 189.536 117.675 183.143 119.854C182.265 120.161 181.387 120.454 180.57 120.731C179.753 121.007 179.608 121.419 179.569 121.691C179.2 124.321 186.55 130.659 191.27 134.052L190.511 135.134Z"
                          fill="white"
                        />
                        <path
                          d="M163.587 91.9447C162.862 91.9623 162.148 91.7689 161.532 91.3881C158.616 89.5295 159.776 83.7916 159.846 83.5505L161.132 83.8179C160.838 85.2338 160.456 89.1438 162.239 90.2791C163.376 91.0023 165.94 90.9541 171.71 86.6364L172.5 87.6885C168.698 90.5333 165.751 91.9447 163.587 91.9447Z"
                          fill="white"
                        />
                        <path
                          d="M205.47 64.8772L204.06 64.2635L204.003 64.3468L203.235 65.4558L200.302 69.7121L200.952 70.1505L205.158 72.9514L206.475 73.8281L209.584 75.8971L214.141 70.9351L215.195 69.7866L215.634 69.3088L205.47 64.8772ZM213.417 69.7691L212.512 70.7554L209.377 74.17L206.475 72.2369L205.158 71.3603L202.15 69.3571L204.28 66.2887L204.534 65.9161H204.578L212.679 69.4228L213.417 69.7691Z"
                          fill="black"
                        />
                        <path
                          d="M74.9013 8.12042L48.9058 26.7019L67.5298 52.6658L93.5253 34.0843L74.9013 8.12042Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M240.283 23.9324L228.46 32.3832L236.93 44.1914L248.753 35.7407L240.283 23.9324Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M77.0551 189.16C2.10591 189.16 1.31998 188.682 0.937988 188.454L1.61416 187.328C1.57845 187.305 1.5401 187.288 1.5 187.275C5.68433 188.314 192.017 187.713 289.969 187.231V188.546C289.253 188.546 217.522 188.892 146.481 189.063C118.183 189.125 95.395 189.16 77.0551 189.16Z"
                          fill="black"
                        />
                        <path
                          d="M71.3473 162.724C71.3473 162.724 62.2717 167.054 61.3541 173.923C60.4364 180.792 56.7658 171.175 51.2555 172.547C45.7451 173.919 48.5025 183.996 41.6223 181.248C34.7421 178.499 28.3229 183.536 20.0684 188.117H91.6191C91.6191 188.117 75.8433 187.235 71.3473 162.724Z"
                          fill="black"
                        />
                        <path
                          d="M192.052 187.656C192.052 187.656 200.767 186.284 204.434 182.62C208.1 178.955 212.692 187.656 214.532 184.908C216.372 182.16 215.45 175.295 216.828 176.211C218.207 177.127 220.486 184.908 223.226 182.146C225.965 179.385 220.218 172.661 226.08 166.186C226.08 166.186 229.386 185.548 243.735 187.512L192.052 187.656Z"
                          fill="black"
                        />
                        <path
                          d="M79.8035 43.9553L70.3855 29.6392L57.1563 38.3139L49.3804 43.4118L63.0749 64.233L84.0756 50.4647L79.8035 43.9553ZM51.2025 43.7888L57.9203 39.3835L69.9903 31.4627L78.7146 44.7224L82.2272 50.079L63.4262 62.4051L51.2025 43.7888Z"
                          fill="black"
                        />
                      </svg>
                      <h1 className="mt-6 text-2xl font-semibold mb-6">
                        Funds successfully sent
                      </h1>
                      {values.address.preferred === "0" && (
                        <p className="mb-6 w-[310px]">
                          You can find your contract in the Future screen, where
                          it will remain in pending status until it is ready to
                          be collected.
                        </p>
                      )}
                      {values.address.preferred === "1" && (
                        <p className="mb-6 w-[310px]">
                          Please now inform your recipient that they can find
                          the contract in the Future screen in their FutureCash
                          MiniDapp.
                        </p>
                      )}
                      <Button
                        onClick={() => {
                          setStep(0);
                          resetForm();
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  }
                />
              </div>,
              document.body
            )}
          {step === 3 &&
            createPortal(
              <div className="z-50 bg-base absolute top-0 left-0 right-0 bottom-0 h-full">
                <Grid
                  header={<div />}
                  content={
                    <div className="flex flex-col text-center items-center">
                      <svg
                        width="183"
                        height="196"
                        viewBox="0 0 183 196"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M103.818 146.407C105.4 134.164 99.6007 113.801 97.508 108.205C95.4153 102.608 93.105 93.9592 93.4017 90.7206C93.6984 87.4821 83.7927 76.5028 83.7927 76.5028C83.5361 76.6191 83.2911 76.7593 83.0608 76.9214L60.9628 78.4775C60.9628 78.4775 50.1511 90.3257 57.2837 108.493C59.056 112.999 57.8811 117.332 54.9101 119.686C51.9392 122.039 47.1445 132.059 52.8214 138.54C58.4982 145.021 57.6002 152.971 55.1949 157.979C52.7897 162.987 48.6241 170.056 57.8811 179.187H70.7261C70.7261 179.187 74.9076 168.583 77.5976 162.995C79.362 159.322 81.8938 151.585 82.6692 142.126C83.939 143.966 85.3513 145.613 86.5935 147.205C90.6009 152.339 88.5478 153.575 86.455 164.187C84.3623 174.799 92.2031 178.8 92.2031 178.8L103.015 178.405C105.092 174.274 102.671 155.171 103.818 146.407Z"
                          fill="black"
                        />
                        <path
                          d="M61.75 78.9119L62.9012 71.5384L64.0722 71.72L63.1465 77.6165L83.6859 76.0881L82.6692 70.5194L83.8322 70.3062L85.0902 77.1702L61.75 78.9119Z"
                          fill="black"
                        />
                        <path
                          d="M62.7624 179.831C59.2851 176.833 59.7124 165.826 62.6635 161.664C65.1874 158.109 67.0151 144.543 61.1602 139.547C59.2297 137.896 58.1854 135.894 58.0548 133.595C57.7977 128.927 61.3185 124.117 64.3171 120.922C68.8071 116.123 65.4366 107.411 65.401 107.324L66.5048 106.89C66.659 107.284 70.1878 116.368 65.1835 121.727C62.8574 124.216 58.9924 129.054 59.2495 133.532C59.3603 135.507 60.2662 137.213 61.9396 138.647C68.3562 144.132 66.4138 158.445 63.6406 162.343C61.0495 165.992 60.5589 176.352 63.5457 178.931L62.7624 179.831Z"
                          fill="white"
                        />
                        <path
                          d="M71.3073 179.25L70.2432 178.729C78.6377 161.747 81.5137 147.177 82.4473 137.955C83.6341 126.155 82.2258 117.924 80.6474 114.464C76.996 106.463 79.6979 96.3248 79.8127 95.9022L80.9599 96.2103C80.9322 96.313 78.258 106.372 81.7274 113.983C85.1453 121.467 87.0996 147.284 71.3073 179.25Z"
                          fill="white"
                        />
                        <path
                          d="M68.0401 190.64L72.8466 178.397H55.3296L56.1208 193.8L56.1841 194.985H58.3717L58.7673 193.8L59.2025 192.516L60.504 193.8L61.2952 194.59H72.9693V190.64H68.0401ZM58.7001 190.344L57.5331 193.8H57.3194L56.5836 179.582H71.106L66.2995 191.825H71.7825V193.405H61.8055L58.7001 190.344Z"
                          fill="black"
                        />
                        <path
                          d="M100.882 190.246L105.689 178.002H88.1719L88.9947 193.8L89.0343 194.59H91.2457L91.5147 193.8L92.0804 192.122L93.7814 193.8L94.177 194.195H105.827V190.246H100.882ZM91.5424 189.949L90.3754 193.405H90.1617L89.422 179.187H103.948L99.1576 191.43H104.641V193.01H94.6478L91.5424 189.949Z"
                          fill="black"
                        />
                        <path
                          d="M70.0731 48.2685C69.9178 48.7564 69.6855 49.2164 69.3847 49.6311C69.1527 49.962 68.8976 50.2761 68.6212 50.571L67.8023 50.1287L67.6006 49.9312C67.8674 49.6608 68.1146 49.3717 68.3404 49.0663C68.8823 48.3317 69.1078 47.684 69.005 47.1666C68.8773 46.7145 68.5578 46.3408 68.1307 46.1437L68.5896 45.0537C69.3756 45.3936 69.9598 46.0775 70.172 46.906C70.2581 47.361 70.224 47.8306 70.0731 48.2685Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M72.8541 66.6293C72.248 67.2354 71.417 67.5629 70.5596 67.5337C67.7905 67.5337 64.4437 64.8403 64.2617 64.6902L65.0134 63.7739C66.3979 64.9035 70.3539 67.4745 72.0115 65.796L72.8541 66.6293Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M81.9215 56.4044C81.8727 56.5069 81.8144 56.6048 81.7475 56.6966L80.7822 56.0055C80.8205 55.9542 80.8524 55.8985 80.8772 55.8396L81.9215 56.4044Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M75.1726 59.7297C75.0228 59.9062 74.8384 60.0501 74.6306 60.1523C74.3855 60.2798 74.1155 60.3526 73.8394 60.3656H73.7049C71.5964 60.3656 68.5621 57.5773 68.2021 57.2535L68.9933 56.3885C70.1801 57.4825 72.4469 59.1808 73.6772 59.1808H73.7524C73.927 59.1815 74.0937 59.1083 74.2113 58.9794L75.1726 59.7297Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M85.272 62.3561L84.9317 63.4896C84.5953 63.3786 84.2268 63.4235 83.9269 63.612C82.8272 64.2479 82.0716 66.341 81.7867 67.3758C81.7591 67.4785 81.7393 67.5693 81.7195 67.6483L81.1498 67.518L80.5723 67.3837C80.6593 66.9887 81.4782 63.6673 83.3414 62.5852C83.9227 62.2371 84.6252 62.1538 85.272 62.3561Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M182.826 193.8H0.456055V194.985H182.826V193.8Z"
                          fill="black"
                        />
                        <path
                          d="M25.3192 194.985C26.506 195.38 51.4682 194.985 51.4682 194.985C51.4682 194.985 52.5521 187.876 45.3443 185.901C38.1365 183.927 39.3352 184.321 38.9356 174.448C38.5361 164.574 36.5304 149.172 30.5252 157.071C24.5201 164.969 27.7205 174.448 22.1148 179.187C16.5092 183.927 14.104 186.296 14.104 194.985H25.3192Z"
                          fill="black"
                        />
                        <path
                          d="M115.816 32.238L114.408 32.1077L111.176 27.6725L108.913 24.5723L87.3571 37.4039L81.53 40.8675L77.3525 38.8099L76.2132 38.2451L75.9363 38.1108L69.0608 34.7143L67.9847 34.1851L66.2125 33.3123L56.6113 44.0744L62.2644 47.1273C61.4732 51.7876 59.1471 63.774 57.4935 72.1744L57.3432 72.9643L62.7312 72.4864L63.9497 72.3758L82.6654 70.7131L83.8522 70.6065L90.9729 69.9746L90.245 65.4999L88.5123 54.8879L95.993 58.1066L105.032 62.0323L121.311 32.7475L115.816 32.238ZM58.4983 43.7427L66.5013 34.7696L67.2925 35.1646L68.3566 35.6898L75.6356 39.2838L76.0826 39.5049L77.2022 40.0539L81.5775 42.2142L86.1624 39.4852L86.8231 39.0903L87.1 38.9244L108.581 26.1402L112.834 31.9576L113.763 33.2333L115.1 35.0658L101.235 44.2284L99.0391 45.6976L98.8532 45.8161L97.7495 46.5467L90.0591 51.6217L88.2037 52.8421L87.6618 53.1975L87.1198 53.5609L86.471 53.9913L82.4122 56.673L81.886 56.3886L80.8456 55.8239L77.0044 53.7465L69.3693 49.6154L68.3012 49.0467L63.5541 46.4875L62.4583 45.899L58.4983 43.7427ZM89.0938 65.7369L89.6081 68.8964L58.8069 71.6254C59.7089 67.052 62.3673 53.4582 63.3563 47.7157L67.7751 50.1091L68.594 50.5514L76.3042 54.7141L82.4596 58.0395L87.3057 54.8405L89.0938 65.7369ZM104.498 60.5158L94.917 56.361L88.9514 53.7702L91.0678 52.3721L98.8928 47.2063L99.9213 46.523L116.797 35.3818L115.338 33.3873L119.393 33.7586L104.498 60.5158Z"
                          fill="black"
                        />
                        <path
                          d="M121.311 19.6313L118.107 25.1605H117.355L118.937 21.606H115.705L111.955 26.9535L111.235 27.6763L110.555 28.3635L113.324 32.0048L114.159 33.1067L114.914 32.7118L115.875 32.226L119.998 30.1565L128.479 19.6313H121.311ZM119.27 29.2323L114.542 31.602L112.169 28.4622L112.881 27.7474L116.338 22.7909H117.13L115.527 26.3453H118.791L121.995 20.8162H126.027L119.27 29.2323Z"
                          fill="black"
                        />
                        <path
                          d="M72.4784 42.4194L71.4657 43.0514C69.7923 40.4092 66.7739 42.0008 66.6473 42.0719L66.0776 41.0293C67.5097 40.2552 70.6745 39.5482 72.4784 42.4194Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M76.6441 50.3736C76.2294 50.5762 75.7725 50.6777 75.3109 50.6698C73.3725 50.6698 71.173 49.1414 70.0732 48.2685C69.7369 48.0039 69.5035 47.7986 69.4165 47.7156L70.1523 46.9021L70.2117 46.8389C71.2877 47.8065 74.4485 50.1366 76.1179 49.3151L76.6441 50.3736Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M94.5883 43.6912C94.2875 43.7926 93.972 43.8433 93.6547 43.8413C93.4662 43.8422 93.2781 43.825 93.0929 43.79C91.8784 43.5806 90.7826 42.7315 90.0349 42.0009C89.6771 41.6516 89.3452 41.2768 89.042 40.8793L89.671 40.4172L89.9993 40.1763C90.2309 40.4865 90.4848 40.7795 90.7589 41.053C91.4789 41.7758 92.5074 42.5736 93.5004 42.6565C93.7459 42.6799 93.9936 42.653 94.2283 42.5775L94.434 43.2055L94.5883 43.6912Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M101.927 34.5601C98.3465 36.6059 95.2766 39.0151 95.3597 39.7181L94.2956 40.2394C93.3778 38.4266 98.3148 35.2592 101.337 33.5254L101.927 34.5601Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M107.069 34.2441C107.029 35.2883 106.698 36.3006 106.112 37.1667L105.61 36.7717L105.167 36.436C105.655 35.6766 105.911 34.7912 105.902 33.8887C105.921 33.4365 105.904 32.9835 105.851 32.534L106.753 32.4077L107.026 32.3682C107.102 32.9905 107.117 33.6189 107.069 34.2441Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M100.858 41.1517C100.562 41.4874 98.9912 43.2567 97.2782 44.8681C96.9736 45.1564 96.6651 45.4368 96.3605 45.7014C95.2132 46.7006 94.0897 47.5102 93.3183 47.6761L93.0889 46.515C93.5755 46.4202 94.3706 45.8633 95.2805 45.0853C95.5811 44.8325 95.8936 44.5521 96.2101 44.2559C97.5393 43.0237 98.9793 41.5229 99.9643 40.3855L100.858 41.1517Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M65.0295 44.1809L64.5033 45.2393C62.9209 44.4494 62.8141 42.6643 62.9842 41.827L64.1473 42.06C64.1354 42.143 63.8664 43.6043 65.0295 44.1809Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M64.7407 58.0551L64.0326 59.0109C62.1258 57.597 64.2185 53.2053 64.6576 52.3403L65.7179 52.8774C64.8198 54.6073 63.9021 57.4548 64.7407 58.0551Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M66.1847 67.0637L65.7456 68.1696C64.8683 67.7918 63.8466 68.0344 63.2336 68.7659L62.2881 68.0471C63.2248 66.8929 64.8111 66.4925 66.1847 67.0637Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M101.927 56.8031C100.372 56.8031 98.5561 54.8284 98.3662 54.5836L99.2523 53.7937C99.9328 54.5599 101.203 55.6183 101.934 55.6183H101.962C102.122 55.6219 102.271 55.5426 102.358 55.409L103.303 56.1278C103.004 56.5392 102.531 56.7887 102.022 56.8031H101.927Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M101.863 50.4604C101.665 49.9728 101.679 49.4244 101.903 48.9478C102.639 47.3088 105.495 46.2425 105.819 46.1279L106.215 47.2417C105.179 47.6366 103.379 48.541 102.983 49.4296C102.889 49.6127 102.88 49.828 102.959 50.0181L101.863 50.4604Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M108.438 49.4771L107.604 48.6319C108.79 47.4471 109.324 43.9439 109.431 42.6841L110.618 42.7868C110.57 43.2923 110.147 47.7907 108.438 49.4771Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M94.2283 53.545C93.813 51.8941 95.3281 50.816 96.2063 50.4763L96.6415 51.5782C96.5822 51.6058 95.1303 52.2022 95.3953 53.2527L94.2283 53.545Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M113.419 42.7355H112.232C112.232 41.8508 112.956 40.3658 113.098 40.0973L114.159 40.6344C113.85 41.2387 113.419 42.2892 113.419 42.7355Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M76.9092 67.3482L75.8569 67.8853L74.6543 65.5156L75.7105 64.9785L76.9092 67.3482Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M174.464 174.661C173.083 173.267 171.03 172.947 168.36 173.709C164.404 174.835 160.657 176.502 157.639 177.84C154.383 179.282 151.021 180.775 150.253 180.1C150.091 179.961 149.786 179.412 150.407 177.335C150.866 175.807 151.511 174.006 152.192 172.102C154.605 165.388 157.097 158.417 154.648 155.89C153.639 154.847 152.01 154.705 149.656 155.459C143.097 157.556 138.069 161.861 136.842 166.427C136.217 168.757 136.696 170.949 138.187 172.588C138.793 173.251 138.828 173.591 138.809 173.638C138.789 173.686 138.547 173.852 137.776 173.82C134.773 173.686 128.377 170.601 126.304 164.938C125.39 162.434 123.867 162.023 123.04 162.003C121.2 161.96 119.258 163.682 118.111 166.399C115.706 172.078 116.56 181.49 126.161 190.85L126.335 191.02H174.776L174.903 190.597C175.049 190.127 178.416 178.646 174.464 174.661ZM173.886 189.851H126.85C117.838 180.961 116.999 172.165 119.234 166.873C120.168 164.669 121.671 163.204 122.996 163.204H123.04C123.946 163.228 124.721 163.994 125.22 165.36C127.57 171.814 134.651 174.878 137.744 175.021C139.153 175.08 139.699 174.586 139.9 174.156C140.201 173.52 139.928 172.73 139.085 171.806C137.855 170.455 137.483 168.706 138.009 166.747C139.133 162.56 143.852 158.579 150.04 156.605C151.891 156.012 153.161 156.056 153.817 156.731C155.748 158.725 153.169 165.929 151.096 171.719C150.407 173.638 149.759 175.455 149.288 177.007C148.663 179.092 148.726 180.321 149.49 180.988C150.827 182.173 153.734 180.878 158.141 178.923C161.104 177.607 164.827 175.949 168.684 174.843C170.907 174.207 172.569 174.428 173.621 175.491C176.695 178.595 174.448 187.765 173.886 189.851Z"
                          fill="black"
                        />
                        <path
                          d="M143.623 75.3164L113.88 81.976L120.567 111.686L150.31 105.026L143.623 75.3164Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M134.516 108.493L131.62 92.5847L116.928 95.2466L108.3 96.8264L112.501 119.938L135.841 115.712L134.516 108.493ZM113.458 118.544L109.68 97.7624L117.197 96.4038L130.679 93.9591L133.369 108.75L134.457 114.741L113.458 118.544Z"
                          fill="black"
                        />
                        <path
                          d="M85.7941 34.2441C83.7765 33.2489 83.737 27.5302 83.7726 25.7095L85.1928 25.9701C85.1928 25.9701 89.8015 18.5887 77.3995 16.7206C77.3995 16.7206 77.2611 16.6654 77.0277 16.5943C77.7986 13.4551 76.0725 10.2411 73.0269 9.14493C69.9812 8.04873 66.598 9.42371 65.1851 12.3319C63.7723 15.24 64.7854 18.7438 67.5333 20.4528C67.4202 20.5222 67.3165 20.6059 67.2248 20.7016C65.8956 22.0484 66.2714 22.9133 66.4533 24.8011C66.6353 26.6889 65.1756 25.8951 63.6842 26.681C62.1928 27.467 60.2385 28.5728 62.3866 30.0222L69.1948 32.5577L68.008 34.1928L67.5135 34.8642C67.4416 34.9621 67.3768 35.065 67.3197 35.1722L68.3839 35.6975C68.4091 35.6492 68.4382 35.6029 68.4709 35.5593L69.0841 34.722L70.3539 32.9882L74.9547 34.7023C75.2854 34.2917 75.5521 33.8337 75.7459 33.3437C76.0474 33.5058 76.3641 33.6381 76.6914 33.7386L76.371 36.8981C76.2246 37.2931 76.0822 37.7078 75.9556 38.1303C75.829 38.5529 75.738 38.9202 75.6549 39.3152L76.1059 39.5363L77.2255 40.0892L81.6047 42.2496L86.1976 39.5166L86.8583 39.1216C86.8859 39.0229 86.9136 38.9281 86.9374 38.8373C87.1273 38.1501 87.3053 37.6525 87.3844 37.4273C87.7958 36.2188 88.1954 35.429 85.7941 34.2441ZM75.9793 32.1233C75.9585 31.6957 75.7957 31.2872 75.5165 30.9622C74.1991 29.3824 73.0915 28.1344 74.3297 27.2971C75.5679 26.4599 75.5402 25.1329 74.9547 23.9638L74.935 23.9283C74.7945 23.6411 74.8834 23.2947 75.1448 23.1102C75.4062 22.9258 75.763 22.9578 75.9872 23.1858L77.3995 24.5444L81.7748 25.3343C81.7353 27.6289 81.2882 31.0175 79.1441 32.3603C78.1314 33.0001 77.0039 32.7473 75.9793 32.1233Z"
                          fill="black"
                        />
                        <path
                          d="M124.361 6.53919L122.019 6.80775C121.46 6.87473 120.907 6.99373 120.37 7.1632L116.683 0.449219C116.683 0.449219 114.788 4.00368 114.808 7.04077L109.839 6.2035C109.839 6.2035 111.912 10.8954 114.835 12.3646C114.321 13.6896 114.139 15.1199 114.305 16.5312L116.647 16.2626C121.465 15.7018 124.918 11.3501 124.361 6.53919Z"
                          fill="black"
                        />
                        <path
                          d="M124.163 7.56592L128.827 8.56907L123.685 9.75389L124.163 7.56592Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M82.5819 49.4494H81.3951C81.3951 48.0474 79.516 46.8784 77.9969 46.1991C77.5454 45.9944 77.0817 45.8176 76.6084 45.6699L76.9565 44.5364L77.0277 44.5601C77.7082 44.7773 82.5819 46.44 82.5819 49.4494Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M89.2121 46.6572L88.3813 47.5023C88.0043 47.1368 87.6081 46.7914 87.1945 46.4676C86.9888 46.3057 86.7752 46.1437 86.5616 45.9858C86.348 45.8278 86.0671 45.6224 85.8258 45.4487C84.6865 44.6588 83.6975 44.0427 83.6816 44.0308L84.3067 43.0198C84.3581 43.0514 84.8645 43.3634 85.5607 43.8294L86.3321 44.3586L86.9176 44.7536C87.7253 45.3348 88.4919 45.9709 89.2121 46.6572Z"
                          fill="#3DA2FF"
                        />
                      </svg>

                      <h1 className="mt-6 text-2xl font-semibold mb-6">
                        Your transaction is pending
                      </h1>
                      <p className="mb-6 w-[310px]">
                        Visit the Pending MiniDapp to confirm this transaction.
                      </p>

                      <Button
                        onClick={() => {
                          setStep(0);
                          resetForm();
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  }
                />
              </div>,
              document.body
            )}
          {status &&
            createPortal(
              <div className="z-50 bg-base absolute top-0 left-0 right-0 bottom-0 h-full">
                <Grid
                  header={<div />}
                  content={
                    <div className="flex flex-col text-center items-center">
                      <svg
                        className="mb-4"
                        width="65"
                        height="12"
                        viewBox="0 0 65 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.04919 11.8124V7.84359C6.04919 7.58409 6.03138 7.2966 5.99576 6.98113C5.96015 6.66566 5.87619 6.3629 5.7439 6.07287C5.61669 5.77775 5.42333 5.53606 5.16383 5.34779C4.90942 5.15953 4.56342 5.06539 4.12583 5.06539C3.89177 5.06539 3.66025 5.10356 3.43128 5.17988C3.2023 5.2562 2.99369 5.3885 2.80542 5.57677C2.62224 5.75994 2.47468 6.01436 2.36274 6.34001C2.2508 6.66057 2.19483 7.07272 2.19483 7.57646L1.1034 7.11088C1.1034 6.4087 1.23823 5.77266 1.50791 5.20278C1.78268 4.63289 2.18465 4.18004 2.71383 3.84421C3.24301 3.5033 3.89431 3.33284 4.66773 3.33284C5.27832 3.33284 5.78206 3.4346 6.17894 3.63813C6.57583 3.84167 6.8913 4.10117 7.12536 4.41664C7.35942 4.73211 7.53242 5.06794 7.64436 5.42412C7.75631 5.7803 7.82754 6.11867 7.85807 6.43923C7.89369 6.7547 7.9115 7.01166 7.9115 7.2101V11.8124H6.04919ZM0.33252 11.8124V0.821777H1.97349V6.60714H2.19483V11.8124H0.33252Z"
                          fill="#08090B"
                        />
                        <path
                          d="M20.1077 11.8124V6.80558C20.1077 6.24079 19.9678 5.80065 19.6879 5.48518C19.4081 5.16462 19.029 5.00434 18.5507 5.00434C18.2556 5.00434 17.991 5.07303 17.7569 5.21041C17.5229 5.3427 17.3372 5.54115 17.1998 5.80574C17.0624 6.06524 16.9937 6.37562 16.9937 6.73689L16.177 6.25605C16.1719 5.68616 16.2992 5.18497 16.5587 4.75247C16.8232 4.31487 17.1794 3.97396 17.6272 3.72972C18.075 3.48549 18.5736 3.36337 19.1231 3.36337C20.0339 3.36337 20.731 3.63813 21.2144 4.18767C21.7029 4.73211 21.9471 5.44956 21.9471 6.34001V11.8124H20.1077ZM10.1932 11.8124V3.56944H11.8189V6.1263H12.0479V11.8124H10.1932ZM15.1619 11.8124V6.82848C15.1619 6.25351 15.022 5.80574 14.7421 5.48518C14.4623 5.16462 14.0807 5.00434 13.5973 5.00434C13.1292 5.00434 12.7526 5.16462 12.4677 5.48518C12.1878 5.80574 12.0479 6.22298 12.0479 6.73689L11.2236 6.18736C11.2236 5.65309 11.3559 5.17225 11.6205 4.74483C11.8851 4.31742 12.2413 3.98159 12.689 3.73736C13.1419 3.48803 13.6482 3.36337 14.2079 3.36337C14.8236 3.36337 15.3375 3.49566 15.7496 3.76025C16.1669 4.01975 16.4772 4.37593 16.6808 4.82879C16.8894 5.27656 16.9937 5.78284 16.9937 6.34764V11.8124H15.1619Z"
                          fill="#08090B"
                        />
                        <path
                          d="M34.1424 11.8124V6.80558C34.1424 6.24079 34.0025 5.80065 33.7226 5.48518C33.4428 5.16462 33.0637 5.00434 32.5854 5.00434C32.2903 5.00434 32.0257 5.07303 31.7916 5.21041C31.5576 5.3427 31.3718 5.54115 31.2344 5.80574C31.0971 6.06524 31.0284 6.37562 31.0284 6.73689L30.2117 6.25605C30.2066 5.68616 30.3338 5.18497 30.5933 4.75247C30.8579 4.31487 31.2141 3.97396 31.6619 3.72972C32.1096 3.48549 32.6083 3.36337 33.1578 3.36337C34.0686 3.36337 34.7657 3.63813 35.2491 4.18767C35.7376 4.73211 35.9818 5.44956 35.9818 6.34001V11.8124H34.1424ZM24.2279 11.8124V3.56944H25.8536V6.1263H26.0826V11.8124H24.2279ZM29.1966 11.8124V6.82848C29.1966 6.25351 29.0567 5.80574 28.7768 5.48518C28.497 5.16462 28.1153 5.00434 27.632 5.00434C27.1638 5.00434 26.7873 5.16462 26.5024 5.48518C26.2225 5.80574 26.0826 6.22298 26.0826 6.73689L25.2583 6.18736C25.2583 5.65309 25.3906 5.17225 25.6552 4.74483C25.9198 4.31742 26.2759 3.98159 26.7237 3.73736C27.1766 3.48803 27.6828 3.36337 28.2425 3.36337C28.8582 3.36337 29.3721 3.49566 29.7843 3.76025C30.2015 4.01975 30.5119 4.37593 30.7155 4.82879C30.9241 5.27656 31.0284 5.78284 31.0284 6.34764V11.8124H29.1966Z"
                          fill="#08090B"
                        />
                        <path
                          d="M48.1771 11.8124V6.80558C48.1771 6.24079 48.0372 5.80065 47.7573 5.48518C47.4774 5.16462 47.0984 5.00434 46.6201 5.00434C46.325 5.00434 46.0604 5.07303 45.8263 5.21041C45.5922 5.3427 45.4065 5.54115 45.2691 5.80574C45.1318 6.06524 45.0631 6.37562 45.0631 6.73689L44.2464 6.25605C44.2413 5.68616 44.3685 5.18497 44.628 4.75247C44.8926 4.31487 45.2488 3.97396 45.6965 3.72972C46.1443 3.48549 46.643 3.36337 47.1925 3.36337C48.1033 3.36337 48.8004 3.63813 49.2838 4.18767C49.7723 4.73211 50.0165 5.44956 50.0165 6.34001V11.8124H48.1771ZM38.2626 11.8124V3.56944H39.8883V6.1263H40.1173V11.8124H38.2626ZM43.2313 11.8124V6.82848C43.2313 6.25351 43.0914 5.80574 42.8115 5.48518C42.5317 5.16462 42.15 5.00434 41.6666 5.00434C41.1985 5.00434 40.822 5.16462 40.537 5.48518C40.2572 5.80574 40.1173 6.22298 40.1173 6.73689L39.293 6.18736C39.293 5.65309 39.4253 5.17225 39.6898 4.74483C39.9544 4.31742 40.3106 3.98159 40.7584 3.73736C41.2112 3.48803 41.7175 3.36337 42.2772 3.36337C42.8929 3.36337 43.4068 3.49566 43.819 3.76025C44.2362 4.01975 44.5466 4.37593 44.7501 4.82879C44.9588 5.27656 45.0631 5.78284 45.0631 6.34764V11.8124H43.2313Z"
                          fill="#08090B"
                        />
                        <path
                          d="M52.6178 11.8124V9.92724H54.503V11.8124H52.6178Z"
                          fill="#08090B"
                        />
                        <path
                          d="M57.5592 11.8124V9.92724H59.4444V11.8124H57.5592Z"
                          fill="#08090B"
                        />
                        <path
                          d="M62.5006 11.8124V9.92724H64.3858V11.8124H62.5006Z"
                          fill="#08090B"
                        />
                      </svg>

                      <svg
                        width="117"
                        height="180"
                        viewBox="0 0 117 180"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M116.328 177.921H0.390625V179.129H116.328V177.921Z"
                          fill="black"
                        />
                        <path
                          d="M84.9688 129.638C86.5686 117.157 80.7573 96.3966 78.6695 90.6913C76.7257 85.3764 74.582 77.3599 74.546 73.6194C74.5406 73.3682 74.5486 73.1168 74.57 72.8665C74.5559 72.1962 74.3397 71.546 73.95 71.0023L72.8782 75.3588L70.1305 69.8306L71.1184 67.5557C70.8224 67.2537 70.5184 66.9477 70.2065 66.6457C68.0271 64.5787 65.7458 62.6235 63.3712 60.7873V59.9821L41.3736 65.2164L41.2537 65.309C39.5714 66.7848 38.2621 68.6425 37.4341 70.7285C37.2741 71.111 37.1221 71.5337 36.9781 71.9364L38.6299 73.4463L36.4662 73.7563C36.4662 73.8409 36.4262 73.9294 36.4102 74.018L39.3099 80.6938L36.8341 85.6784C36.9701 86.2502 37.1261 86.838 37.3021 87.438C37.6341 88.5694 38.03 89.7491 38.502 90.9771C40.2698 95.5712 39.0979 99.9882 36.1022 102.388C33.1066 104.788 28.3471 115.003 34.0145 121.61C39.6818 128.217 38.7859 136.322 36.4142 141.428C34.0944 146.384 30.0909 153.322 38.326 162.244C38.574 162.51 38.8299 162.78 39.0979 163.049H51.9245L51.9965 162.86C52.0525 162.723 52.1325 162.514 52.2364 162.244C53.2563 159.635 56.54 151.3 58.7837 146.541C60.5475 142.797 63.0792 134.913 63.8552 125.27C63.9911 125.475 64.1311 125.672 64.2551 125.878C65.407 127.513 66.6549 128.998 67.7547 130.444C71.7543 135.678 69.7065 136.938 67.6187 147.757C66.0509 155.87 70.0665 160.203 72.1662 161.849C72.5427 162.152 72.9441 162.421 73.3661 162.655L84.1649 162.252C84.2249 162.131 84.2809 161.994 84.3369 161.849C86.1207 156.929 83.8569 138.315 84.9688 129.638Z"
                          fill="black"
                        />
                        <path
                          d="M40.9731 65.3729V57.767H42.173V63.8509L62.1948 59.1722L60.331 53.7165L61.4629 53.3259L63.7626 60.046L40.9731 65.3729Z"
                          fill="black"
                        />
                        <path
                          d="M70.5144 24.1817C68.6677 22.2725 66.4237 20.7989 63.9438 19.8667C61.464 18.9345 58.8098 18.5669 56.172 18.7903L49.9247 19.3138L50.0247 20.5217L56.268 19.9982C58.7299 19.7878 61.2075 20.1297 63.5223 20.9993C65.8371 21.8689 67.9314 23.2446 69.6545 25.0272L96.3276 52.5314L80.0414 69.3093L70.7984 56.28L79.3015 49.7572L63.3312 34.916L60.5315 25.7801L59.3877 26.1345L66.9868 51.0376L36.9901 58.5065C37.2181 52.5918 37.994 32.0975 37.7901 31.0627L36.6142 31.3084C36.6782 31.711 36.6142 34.8113 36.4902 39.039L36.2982 38.9142L23.9156 57.9872L36.8222 64.8924L30.8628 80.2651L4.38175 65.9715L22.3398 30.8131C23.3427 28.8388 24.7823 27.1224 26.5476 25.7961C28.313 24.4699 30.3571 23.569 32.5226 23.163L40.0858 21.7296L39.8618 20.5217L32.2987 21.9712C29.954 22.4126 27.7411 23.3895 25.8302 24.8267C23.9193 26.2639 22.3612 28.1232 21.2759 30.2615L2.77393 66.4748L31.4867 81.9723L38.326 64.3287L25.6354 57.5644L36.4022 40.9435C36.2262 46.5804 35.9702 53.6991 35.7503 59.2836L35.7183 60.0889L68.5147 51.9274L64.0351 37.2352L77.4417 49.6928L69.1466 56.0545L79.9014 71.2098L98.0074 52.5314L70.5144 24.1817Z"
                          fill="black"
                        />
                        <path
                          d="M41.3173 74.2919L37.4337 70.7285L36.2618 69.6454L35.5019 68.9489L32.8462 76.1319L33.1982 77.5532L36.1738 89.7008L37.2937 87.446L40.6293 80.7341L38.0336 74.7629L41.3173 74.2919ZM39.3175 80.7019L36.8417 85.6865L36.5738 86.2301L34.1061 76.2124L36.0138 71.0546L36.9857 71.9445L38.6376 73.4544L36.4738 73.7644L36.3138 73.7886L36.4178 74.0261L39.3175 80.7019Z"
                          fill="black"
                        />
                        <path
                          d="M72.4461 58.7966L71.6942 59.6301L68.2666 63.435L71.4023 63.89L70.2024 66.6441L68.8025 69.8652L73.254 78.8319L74.5419 73.6218L76.3617 66.2293L76.6097 65.2147L72.4461 58.7966ZM73.95 71.0006L72.8781 75.3571L70.1304 69.8289L71.1183 67.554L73.1181 62.9156L70.6583 62.5653L72.2782 60.7615L75.3098 65.412L73.95 71.0006Z"
                          fill="black"
                        />
                        <path
                          d="M43.9771 163.714C40.5055 160.654 40.9334 149.437 43.8811 145.193C46.4008 141.569 48.2166 127.735 42.3813 122.645C40.4535 120.966 39.4096 118.925 39.2816 116.606C39.0176 111.843 42.5332 106.942 45.5329 103.677C50.0164 98.785 46.6488 89.9028 46.6128 89.8142L47.7327 89.3713C47.8846 89.774 51.4123 99.0347 46.4128 104.498C44.0891 107.035 40.2255 111.971 40.4775 116.537C40.5425 117.546 40.815 118.531 41.2776 119.428C41.7403 120.326 42.383 121.117 43.1652 121.751C49.5645 127.34 47.6287 141.928 44.865 145.91C42.2733 149.634 41.7853 160.199 44.769 162.821L43.9771 163.714Z"
                          fill="white"
                        />
                        <path
                          d="M52.512 163.12L51.4321 162.589C59.8312 145.275 62.6909 130.422 63.6228 121.02C64.8227 108.99 63.4028 100.599 61.823 97.0714C58.1794 88.914 60.8751 78.5783 60.9911 78.1475L62.1509 78.4615C62.1229 78.5622 59.4512 88.8214 62.9189 96.5802C66.3345 104.214 68.2823 130.531 52.512 163.12Z"
                          fill="white"
                        />
                        <path
                          d="M49.2491 174.732L54.0485 162.25H36.5425L37.3424 177.953L37.4024 179.161H39.6021L40.0021 177.953L40.434 176.656L42.5218 178.758H54.1725V174.732H49.2491ZM39.9101 174.418L38.7422 177.953H38.5423L37.8063 163.458H52.2967L47.4973 175.94H52.9727V177.55H43.0218L39.9101 174.418Z"
                          fill="black"
                        />
                        <path
                          d="M82.045 174.33L86.8444 161.849H69.3384L70.1703 177.954L70.2103 178.759H72.41L72.678 177.954L73.2419 176.255L75.3297 178.357H86.9684V174.33H82.045ZM72.706 174.016L71.5381 177.551H71.3382L70.6022 163.056H85.0926L80.2932 175.538H85.7686V177.149H75.8177L72.706 174.016Z"
                          fill="black"
                        />
                        <path
                          d="M43.2655 35.9669L42.2816 35.2744C43.1615 34.0101 43.4814 32.9673 43.2375 32.2667C43.1435 32.0526 43.0042 31.8618 42.8295 31.7074C42.6547 31.553 42.4486 31.4389 42.2256 31.3728L42.5176 30.2012C42.9272 30.3165 43.3058 30.5234 43.625 30.8064C43.9443 31.0894 44.196 31.4413 44.3613 31.8359C44.7693 32.9391 44.4013 34.3322 43.2655 35.9669Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M29.375 33.3748C26.7193 32.4849 25.8314 29.8839 25.7754 29.751L26.9113 29.3484C26.9113 29.3484 27.6592 31.4945 29.711 32.191L29.375 33.3748Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M22.0556 48.464L21.0957 47.7393C21.6156 47.0387 26.2951 40.9468 29.8427 42.7305L29.3068 43.8095C27.047 42.666 23.3075 46.785 22.0556 48.464Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M19.6525 41.4608L19.5005 40.2529C22.2282 39.9106 22.9801 36.3392 22.9881 36.303L24.164 36.5405C24.128 36.7298 23.2401 41.0058 19.6525 41.4608Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M13.4406 65.2827C12.9007 64.1955 10.9849 63.6963 10.293 63.5996L10.4609 62.3917C10.5889 62.4119 13.5846 62.8628 14.5125 64.7351L13.4406 65.2827Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M12.6689 57.4897L12.085 56.4348C12.117 56.4147 15.3766 54.5545 15.3766 52.1306H16.5765C16.5765 55.2672 12.8289 57.4011 12.6689 57.4897Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M25.0147 63.2027C23.9948 60.4688 18.5074 61.1654 18.4554 61.1895L18.2954 59.9816C18.5594 59.9494 24.7827 59.1763 26.1345 62.8001L25.0147 63.2027Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M23.1753 74.0752V72.8673C24.8991 72.8673 29.3746 72.3922 29.3746 70.2501H30.5745C30.5745 74.0309 23.4793 74.0752 23.1753 74.0752Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M18.5759 69.604L17.416 69.2859C17.5 68.9759 18.2799 66.2541 19.8158 65.7508C20.1179 65.658 20.4389 65.6463 20.7469 65.7169C21.0549 65.7876 21.3392 65.938 21.5716 66.1534L20.8196 67.0956C20.4637 66.8097 20.2637 66.8741 20.1877 66.8983C19.5038 67.1157 18.8239 68.6095 18.5759 69.604Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M47.181 52.5946C44.5493 52.5946 41.4496 50.7465 41.2656 50.6378L41.8816 49.599C43.4174 50.5291 47.7129 52.5101 49.0808 50.5734L50.0567 51.274C49.3727 52.2484 48.3168 52.5946 47.181 52.5946Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M57.3077 39.9167L56.2358 39.3772C56.2976 39.2529 56.3324 39.1169 56.338 38.978C56.3435 38.8392 56.3196 38.7007 56.2678 38.5719C55.7718 37.207 53.1161 35.8058 52.1362 35.383L52.6082 34.2717C53.0081 34.4489 56.6077 36.0594 57.4076 38.1572C57.5132 38.4414 57.5588 38.7446 57.5416 39.0475C57.5244 39.3505 57.4447 39.6465 57.3077 39.9167Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M49.5326 44.8876C47.4328 44.8876 44.4012 42.818 44.0332 42.5603L44.7131 41.5698C46.065 42.508 48.6527 43.9051 49.8286 43.6515C49.9166 43.6392 50.0009 43.6072 50.0749 43.5577C50.149 43.5082 50.2111 43.4425 50.2565 43.3656L51.2884 43.9857C51.1581 44.2031 50.984 44.3906 50.7773 44.5362C50.5707 44.6818 50.3361 44.7823 50.0885 44.8312C49.9057 44.8694 49.7194 44.8883 49.5326 44.8876Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M58.9709 50.9664L57.771 50.8778C57.799 50.4752 58.095 46.9803 59.7708 45.6113C60.0301 45.3977 60.331 45.2411 60.654 45.1517C60.9771 45.0622 61.3152 45.0419 61.6466 45.0919L61.4786 46.2998C61.3094 46.2735 61.1365 46.284 60.9716 46.3305C60.8067 46.3771 60.6537 46.4586 60.5227 46.5696C59.4428 47.4353 59.0349 50.0363 58.9709 50.9664Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M54.9361 28.8209C54.7695 28.8216 54.6041 28.7916 54.4482 28.7323C53.2163 28.2733 52.6804 26.1151 52.5884 25.6884L53.7563 25.4226C53.9362 26.2279 54.4242 27.4358 54.8641 27.6009C54.9001 27.6009 54.9961 27.6492 55.2121 27.4881L55.932 28.4545C55.6495 28.6843 55.2992 28.8131 54.9361 28.8209Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M67.7703 27.1669H66.5705C66.5705 25.6691 63.5748 23.4868 61.687 22.4641L62.255 21.4011C62.8189 21.7071 67.7703 24.4692 67.7703 27.1669Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M72.3144 39.6393C71.3465 38.4998 70.9026 37.3805 71.0026 36.3135C71.0722 35.554 71.4269 34.8499 71.9945 34.3446L72.7464 35.2868L72.3704 34.8157L72.7504 35.2828C72.4269 35.5869 72.2285 36.0021 72.1944 36.4464C72.1384 37.1711 72.4824 37.9804 73.2263 38.8622L72.3144 39.6393Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M86.9044 48.7756L85.8325 48.2361C86.7444 46.4 82.9209 44.2097 82.8809 44.2097L83.4568 43.1467C83.6568 43.2554 88.3483 45.8887 86.9044 48.7756Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M77.1453 45.7119C75.2615 43.8155 76.9613 40.3327 77.0333 40.1837L78.1052 40.7232C77.7052 41.5285 76.9373 43.7954 77.9932 44.8583L77.1453 45.7119Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M75.9703 57.8153L75.1704 56.9134C75.4304 56.6799 77.7621 54.6265 79.6539 55.0935C80.052 55.2029 80.4154 55.4137 80.709 55.7057C81.0025 55.9977 81.2163 56.361 81.3297 56.7604L80.2099 57.1631C79.9219 56.39 79.5059 56.2894 79.3699 56.2531C78.2861 55.9995 76.5103 57.3282 75.9703 57.8153Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M80.4731 63.6769C80.1369 63.6771 79.8012 63.6502 79.4692 63.5964L79.6652 62.3885C79.8372 62.4167 83.8967 63.0327 84.5767 59.252L85.7765 59.4694C85.1566 62.8233 82.4329 63.6769 80.4731 63.6769Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M87.9562 52.9908L87.1763 52.0728C87.3523 51.9198 88.9481 50.5911 90.4679 50.9011C90.8284 50.9806 91.165 51.1455 91.4495 51.3822C91.734 51.6189 91.9583 51.9205 92.1037 52.262L91.0318 52.8015C90.9627 52.6279 90.8545 52.4728 90.7157 52.3484C90.5769 52.224 90.4113 52.1338 90.2319 52.0848C89.428 51.9278 88.3161 52.6848 87.9562 52.9908Z"
                          fill="#3DA2FF"
                        />
                        <path
                          d="M59.9194 14.5958C59.243 14.1044 58.5195 13.6822 57.7597 13.3356C56.9598 12.9652 56.9598 12.9652 56.9598 11.4633C56.9121 10.17 56.6513 8.89372 56.1878 7.68657C56.6758 5.67338 57.0238 0.30219 46.8249 0.314269C46.8249 0.314269 43.2013 -0.583615 42.5494 2.25901C42.5494 2.25901 42.5494 2.29122 42.5494 2.31135C41.9334 5.2184 38.5258 4.32454 37.4219 5.87873C36.3181 7.43291 36.822 8.25026 37.2939 10.1266C37.7659 12.0029 36.1981 11.4231 34.8462 12.4458C33.4944 13.4685 31.7386 14.8616 34.0783 16.0131L41.1855 17.523L39.8777 20.12C39.7153 20.438 39.6196 20.7862 39.5963 21.143C39.573 21.4998 39.6227 21.8575 39.7423 22.1942C39.8619 22.5308 40.0489 22.8392 40.2916 23.1002C40.5343 23.3612 40.8277 23.5693 41.1535 23.7116L46.6609 26.1274C46.9904 26.2714 47.3455 26.3468 47.7048 26.3488C48.0578 26.3477 48.4069 26.2743 48.7309 26.1332C49.0549 25.992 49.3469 25.786 49.5893 25.5276C49.8318 25.2693 50.0194 24.964 50.141 24.6303C50.2626 24.2967 50.3155 23.9416 50.2965 23.5867L49.9805 17.5754C50.2831 17.5313 50.578 17.4446 50.8564 17.3177C51.7723 17.3459 53.6561 17.362 54.3601 17.362C58.1996 17.362 60.2954 16.911 60.5994 16.0131C60.7154 15.6669 60.6914 15.1475 59.9194 14.5958ZM50.9724 15.8118C50.7341 16.0273 50.4539 16.1905 50.1496 16.291C49.8452 16.3915 49.5234 16.4272 49.2046 16.3956C48.7288 16.3525 48.263 16.2329 47.8248 16.0413C47.7397 15.6173 47.5175 15.2336 47.1928 14.9502C45.649 13.5731 44.3652 12.4699 45.449 11.4392C46.5329 10.4084 46.3129 9.07165 45.553 7.98452C45.5455 7.97437 45.5388 7.9636 45.533 7.95231C45.4509 7.82361 45.4158 7.67022 45.4335 7.51832C45.4513 7.36643 45.5209 7.22545 45.6304 7.11946C45.7399 7.01347 45.8826 6.94904 46.0341 6.93718C46.1856 6.92532 46.3364 6.96676 46.4609 7.05443L48.0608 8.1939L52.4963 8.33079C52.4963 8.37508 52.4963 8.4234 52.4963 8.47171C52.494 8.49044 52.494 8.50936 52.4963 8.52808V8.62472C52.4985 8.64478 52.4985 8.66505 52.4963 8.68511C52.5483 9.53065 52.4963 12.8645 51.6963 14.918C51.5017 15.2513 51.2575 15.5527 50.9724 15.8118ZM48.5007 24.8712C48.3049 25.0098 48.0768 25.0952 47.8386 25.1192C47.6004 25.1432 47.3601 25.1049 47.1409 25.0081L41.6335 22.5922C41.4583 22.5154 41.3006 22.4034 41.1701 22.2629C41.0396 22.1225 40.939 21.9566 40.8746 21.7756C40.8101 21.5945 40.7832 21.4021 40.7954 21.2102C40.8076 21.0183 40.8587 20.8309 40.9455 20.6596L42.4054 17.7847L47.2048 18.8034C47.4748 18.3397 47.673 17.8374 47.7928 17.3136C48.113 17.4251 48.4422 17.5086 48.7767 17.5633L49.0966 23.6391C49.11 23.8786 49.0623 24.1175 48.958 24.3332C48.8537 24.5489 48.6962 24.7341 48.5007 24.8712ZM52.5003 16.1098C52.6116 15.9095 52.7105 15.7024 52.7962 15.4897C54.0241 13.4201 53.9961 10.5292 53.7241 8.42742V8.37911L55.18 8.4234C55.5337 9.39939 55.7334 10.4251 55.7719 11.4633C55.7719 13.5369 56.0319 13.855 57.2517 14.4308C57.9457 14.7454 58.6063 15.1299 59.2235 15.5783L59.3195 15.6508C58.4356 16.0333 55.32 16.1903 52.4803 16.0937L52.5003 16.1098Z"
                          fill="black"
                        />
                      </svg>

                      <h1 className="mt-6 text-2xl font-semibold mb-6">
                        Something went wrong
                      </h1>

                      <ScaleIn isOpen={status}>
                        <p className="red-bad text-base mb-6 max-[310px]">
                          {status}
                        </p>
                      </ScaleIn>

                      <Button
                        onClick={() => {
                          setStatus(undefined);
                          setStep(1);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  }
                />
              </div>,
              document.body
            )}
        </form>
      )}
    </Formik>
  );
};

export default Send;

const formValidation = yup.object().shape({
  token: yup.object().required("Field is required."),
  datetime: yup
    .date()
    .required("Field is required")
    .typeError("Select a valid date and time")
    .test("datetime-check", "Invalid date", function (val) {
      const { path, createError } = this;

      if (val === undefined) {
        return false;
      }

      if (!isDate(val)) {
        return createError({ path, message: "Please select a valid date" });
      }

      return createBlockTime(val)
        .then(() => {
          return true;
        })
        .catch((err) => {
          return createError({
            path,
            message: err.message,
          });
        });
    }),
  address: yup.object().shape({
    hexstring: yup
      .string()
      .required("Please enter an address")
      .matches(/0|M[xX][0-9a-zA-Z]+/, "Invalid Address")
      .min(59, "Invalid Address, too short")
      .max(66, "Invalid Address, too long")
      .test("check-address", "Invalid address", function (val) {
        if (val === undefined) {
          return false;
        }

        return true;
      }),
    preferred: yup
      .string()
      .required("Please select your preference for an address"),
  }),
  amount: yup
    .string()
    .required("Field is required")
    .matches(/^[^a-zA-Z\\;'"]+$/, "Invalid characters")
    .test("check-my-funds", "Insufficient funds.", function (val) {
      const { path, createError, parent } = this;

      if (val == undefined) {
        return false;
      }

      const selectedToken = parent.token;
      if (new Decimal(selectedToken.sendable).lessThan(new Decimal(0.0))) {
        const requiredAmount = new Decimal(val).minus(
          new Decimal(selectedToken.sendable)
        );

        return createError({
          path,
          message: `Insufficient funds, you need another ${requiredAmount.toString()} ${
            typeof selectedToken.token == "string"
              ? selectedToken.token
              : typeof selectedToken.token == "object" &&
                selectedToken.token.hasOwnProperty("name")
              ? selectedToken.token.name
              : "Unknown"
          } `,
        });
      }

      return true;
    }),
  burn: yup.string().matches(/^[^a-zA-Z\\;'"]+$/, "Invalid character"),
});
