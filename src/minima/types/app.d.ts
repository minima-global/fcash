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
  state1: number; // future in block time
  state2: string; // address to be collected
  state3: number; // future in ms
  state4: number; // calculated future block time - current block time
}
export {IFutureCashCollection, IFutureCashPost};