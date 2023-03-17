export const getAddress = () => {
  return new Promise((resolve, reject) => {
    MDS.cmd("getaddress", (res) => {
      if (!res.status) reject(res.error ? res.error : "Rpc Failed!");

      resolve(res.response.miniaddress);
    });
  });
};

export default getAddress;
