import { FocusEvent } from "react";
import styles from "./Address.module.css";
import { useFormikContext } from "formik";

const AddressSelect = () => {
  const formik: any = useFormikContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const personalAddress = e.target.value === "0";

    if (personalAddress) {
      formik.setFieldValue("address.preferred", e.target.value);
      formik.setFieldValue("address.hexstring", "Fetching your address...");

      (window as any).MDS.cmd("getaddress", (resp: any) => {
        if (resp.status) {
          return formik.setFieldValue(
            "address.hexstring",
            resp.response.miniaddress
          );
        }
      });

      return;
    }

    if (!personalAddress) {
      formik.setFieldValue("address.preferred", e.target.value);
      formik.setFieldValue("address.hexstring", "");
    }
  };

  return (
    <>
      <div onChange={handleChange} className={styles["radio-wrapper"]}>
        <label htmlFor="my-address">
          <input
            defaultChecked={formik.values.address.preferred === "0"}
            type="radio"
            id="my-address"
            name="address.preference"
            value={0}
          />
          Use my Minima wallet address
        </label>

        <label htmlFor="custom-address">
          <input
            defaultChecked={formik.values.address.preferred === "1"}
            type="radio"
            id="custom-address"
            name="address.preference"
            value={1}
          />
          Use a different wallet address
        </label>
      </div>
    </>
  );
};

export default AddressSelect;
