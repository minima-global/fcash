import Decimal from "decimal.js";

export const getBlockTimeByDate = async (dateTimeChosenByUser: Date) => {
  return new Promise((resolve, reject) => {
    (window as any).MDS.cmd("block", (resp: any) => {
      const now = new Date().getTime();
      const duration = new Decimal(dateTimeChosenByUser.getTime()).minus(now);
      const currentBlockHeight = resp.response.block;

      if (duration.lessThanOrEqualTo(0)) {
        reject(
          "You have to send cash to the future, not the present or the past."
        );
      }

      const averageBlockTimeMilliSecond = 50 * 1000;
      const calculatedBlocktime = new Decimal(duration).dividedBy(
        averageBlockTimeMilliSecond
      );

      resolve(calculatedBlocktime.add(currentBlockHeight).round().toNumber());
    });
  });
};
