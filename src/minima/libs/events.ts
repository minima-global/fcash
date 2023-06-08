import { Txpow } from "../@types/minima";

////////////// response interfaces //////////
interface InitResponse {
  event: "inited";
}

interface MiningResponse {
  event: "MINING";
  data: MiningData;
}
interface MiningData {
  mining: boolean;
  txpow: Txpow;
}

interface NewBlockResponse {
  event: "NEWBLOCK";
  data: NewBlockData;
}

interface MDSTimerResponse {
  event: "MDS_TIMER_10SECONDS";
  data: Object;
}

interface NewBlockData {
  txpow: Txpow;
}

interface MinimaLogResponse {
  event: "MINIMALOG";
  data: MinimaLogData;
}
interface MinimaLogData {
  message: string;
}

interface NewBalanceResponse {
  event: "NEWBALANCE";
  data: NewBalanceData;
}
interface NewBalanceData {
  // TODO
}
interface NewMDSFail {
  event: "MDSFAIL";
  data: {
    command: string;
    error: number;
    params: string;
  };
}

interface MaximaHosts {
  event: "MAXIMAHOSTS";
  data: any;
}

interface MaximaResponse {
  event: "MAXIMA";
  data: MaximaData;
}
interface MaximaData {
  application: string;
  data: string;
  from: string;
  msgid: string;
  random: string;
  time: string;
  timemilli: number;
  to: string;
}

//////////////////////// empty functions before registration //////////////////////
let whenNewBlock = (d: NewBlockData) => {
  // console.log("NEWBLOCK event ... please resgister custom callback", d);
};
let whenMining = (d: MiningData) => {
  // console.log("MINIMG event ... please resgister custom callback", d);
};
let whenMaxima = (d: MaximaData) => {
  // console.log("MAXIMA event ... please resgister custom callback", d);
};
let whenNewBalance = (d: NewBalanceData) => {
  // console.log("NEW BALANCE event ... please resgister custom callback", d);
};
let whenInit = () => {
  console.log("INIT event ... please register custom callback");
};
let whenMinimaLog = (d: MinimaLogData) => {
  // console.log("MINIMA LOG event ... please resgister custom callback", d);
};

let whenMDSTimer = (d: any) => {
  // console.log("MINIMA MDS TIMER event ... please register custom callback", d);
};
let whenFail = (d: any) => {
  // console.log("MINIMA MDS TIMER event ... please register custom callback", d);
};

///////////////////////////

const initializeMinima = () => {
  MDS.DEBUG_HOST = "127.0.0.1";
  MDS.DEBUG_PORT = 9003;
  MDS.DEBUG_MINIDAPPID =
    "0x45E5DE0AFD5DC382D12A2962001FDBBFB3E031AB8BF6D6FEB83202FF0578EF20D4367A7EDDB50DAED880085F2673B44F027A9A01584910CA7622DD635FC262285F75565E38286D0EFFDF7E5E50FA075EAA2485D77B6BB7A8E7B05E2860190854C43AB2DFD174D464B286D36F172DD7DF9FA039626F482A558B8DFBAF30874C40";

  MDS.init(
    (
      nodeEvent:
        | InitResponse
        | MiningResponse
        | NewBlockResponse
        | MinimaLogResponse
        | NewBalanceResponse
        | MaximaResponse
        | MDSTimerResponse
        | MaximaHosts
        | NewMDSFail
    ) => {
      switch (nodeEvent.event) {
        case "inited":
          whenInit();
          break;
        case "MDSFAIL":
          const errorData = nodeEvent.data;
          whenFail(errorData);
          break;
        case "NEWBLOCK":
          const newBlockData = nodeEvent.data;
          whenNewBlock(newBlockData);
          break;
        case "MINING":
          const miningData = nodeEvent.data;
          whenMining(miningData);
          break;
        case "MAXIMA":
          const maximaData = nodeEvent.data;
          whenMaxima(maximaData);
          break;
        case "NEWBALANCE":
          const newBalanceData = nodeEvent.data;

          whenNewBalance(newBalanceData);
          break;
        case "MINIMALOG":
          const minimaLogeData = nodeEvent.data;
          whenMinimaLog(minimaLogeData);
          break;
        case "MDS_TIMER_10SECONDS":
          const mdstimerdata = nodeEvent.data;
          whenMDSTimer(mdstimerdata);
          break;
        case "MAXIMAHOSTS":
          break;
        default:
          console.error("Unknown event type: ", nodeEvent);
      }
    }
  );
};

// Do registration
// initializeMinima();

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
  whenNewBlock = callback;
}
function onFail(callback: (data: NewMDSFail) => void) {
  whenFail = callback;
}

function onMining(callback: (data: MiningData) => void) {
  whenMining = callback;
}

function onMaxima(callback: (data: MaximaData) => void) {
  whenMaxima = callback;
}

function onNewBalance(callback: (data: NewBalanceData) => void) {
  whenNewBalance = callback;
}

function onInit(callback: () => void) {
  whenInit = callback;

  initializeMinima();
}

function onMDSTimer(callback: (data: any) => void) {
  whenMDSTimer = callback;
}

function onMinimaLog(callback: (data: MinimaLogData) => void) {
  whenMinimaLog = callback;
}

export const events = {
  onNewBlock,
  onMining,
  onMaxima,
  onNewBalance,
  onInit,
  onMinimaLog,
  onMDSTimer,
  onFail,
};
