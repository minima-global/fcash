import { Address } from "./minima";


interface IGetAddress extends Address {
  simple: boolean;
  default: boolean;
  publickey: string;
  track: boolean;
  address: string;
}

export {IGetAddress};