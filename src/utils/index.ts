import { ICoinStatus } from './../redux/slices/minima/coinSlice';
import { Token } from "typescript";
import { Coin, MinimaToken } from "../minima/types/minima";


const numberWithCommas = (x: string) => {
  try {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch (err) {
    console.error(err)
    return x;

  }
}

function copy(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      const result = document.execCommand('copy');
      document.body.removeChild(input);
      if (!result) {
        throw new Error("Copy to clipboard failed.")
      }
      resolve(result);
    } catch (err: any) {
  
      reject(err);
    }
  });  
}


// merge the token and coin and return a new object
const mapCoinToToken = (coin: Coin, token: MinimaToken): any => {
  return Object.assign({}, coin, token);
}

// select a token, iterate through coins and find a coin with same tokenid
const mergeArray = (coins: ICoinStatus[], tokens: MinimaToken[]): any => {
  const mergeArr: any = [];
  
  tokens.map((t) => {
     coins.forEach((c) => {
      let merge = {};
      if (c.tokenid == t.tokenid) {
        merge = mapCoinToToken(c, t);
        mergeArr.push(merge);
      }
    });
  });
  return mergeArr;
}



const containsText = (text: string, searchText: string) =>
    text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

/**
 * 
 * @param imageData tokens image uri
 * @param tokenid tokens id for reference
 */
 const makeTokenImage = (imageData: string, tokenid: string): string | undefined => {
  let imageUrl = undefined;
  try {
      var parser = new DOMParser();
      const doc = parser.parseFromString(imageData, 'application/xml');
      const errorNode = doc.querySelector('parsererror');
      if (errorNode) {
          console.error('Token does not contain an image', tokenid);
      } else {
          var imageString = doc.getElementsByTagName('artimage')[0].innerHTML;
          imageUrl = `data:image/jpeg;base64,${imageString}`;
      }
      
      return imageUrl;
  } catch(err) {
      console.error(`Failed to create image data ${tokenid}`, err);
  }
  
  return undefined;
}


export {
  containsText,
  copy, 
  numberWithCommas,
  mergeArray,
  makeTokenImage
};

