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
const mergeArray = (coins: Coin[], tokens: MinimaToken[]): any => {
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

export {
  containsText,
  copy, 
  numberWithCommas,
  mergeArray
};