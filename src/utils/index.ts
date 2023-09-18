import { Coin, MinimaToken } from "../minima/@types/minima";
import getAppUID from "./getAppUID";

const numberWithCommas = (x: string) => {
  try {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch (err) {
    console.error(err);
    return x;
  }
};

function copy(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement("textarea");
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      const result = document.execCommand("copy");
      document.body.removeChild(input);
      if (!result) {
        throw new Error("Copy to clipboard failed.");
      }
      resolve(result);
    } catch (err: any) {
      reject(err);
    }
  });
}

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

/**
 *
 * @param imageData tokens image uri
 * @param tokenid tokens id for reference
 */
const makeTokenImage = (
  imageData: string,
  tokenid: string
): string | undefined => {
  let imageUrl = undefined;
  try {
    var parser = new DOMParser();
    const doc = parser.parseFromString(imageData, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      console.error("Token does not contain an image", tokenid);
    } else {
      var imageString = doc.getElementsByTagName("artimage")[0].innerHTML;
      imageUrl = `data:image/jpeg;base64,${imageString}`;
    }

    return imageUrl;
  } catch (err) {
    console.error(`Failed to create image data ${tokenid}`, err);
  }

  return undefined;
};

export { getAppUID, containsText, copy, numberWithCommas, makeTokenImage };
