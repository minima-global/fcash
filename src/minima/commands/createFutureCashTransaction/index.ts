export const createFutureCashTransaction = (
  amount: string,
  address: string,
  tokenid: string,
  state: { port: number; data: any }[],
  password: false | string,
  burn: false | string
) => {
  return new Promise((resolve, reject) => {
    MDS.cmd(
      `send amount:${amount} address:${address} tokenid:${tokenid} state:{${state.map(
        (s) => `"${s.port}":"${s.data}"`
      )}} ${password ? `password:${password}` : ""} ${
        burn ? `burn:${burn}` : ""
      }`,
      (res) => {
        if (!res.status && !res.pending)
          reject(
            res.error ? res.error : res.message ? res.message : "RPC Failed"
          );
        if (!res.status && res.pending) reject("pending");

        resolve(true);
      }
    );
  });
};

export default createFutureCashTransaction;
