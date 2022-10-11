/**
 * (coinid: string, address: string, amount: string, tokenid: string, publickey: string) => Promise<string | boolean>
 * 
 */
interface IFutureCashCollection {
  coinid: string;
  address: string;
  tokenid: string;
  amount: string;
}
interface IFutureCashPost {
  amount: string;
  scriptAddress: string;
  tokenid: string;
  state1: number;
  state2: string;
}
export {IFutureCashCollection, IFutureCashPost};