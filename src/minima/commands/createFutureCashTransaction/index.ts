export const createFutureCashTransaction = (
  amount: string,
  address: string,
  tokenid: string,
  state: { port: number; data: any }[],
  password: false | string,
  burn: false | string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(
      `send amount:${amount} address:${address} tokenid:${tokenid} state:{${state.map(
        (s) => `"${s.port}":"${s.data}"`
      )}} ${password ? `password:${password}` : ""} ${
        burn ? `burn:${burn}` : ""
      }`,
      (resp: any) => {
        if (!resp.status && !resp.pending)
          reject(
            resp.error
              ? resp.error
              : "Creating transaction failed, please try again"
          );
        if (!resp.status && resp.pending) resolve("Transaction is pending");

        resolve("Transaction approved");
      }
    );
  });
};

export default createFutureCashTransaction;
