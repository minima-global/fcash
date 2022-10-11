type TypeTxnCommands = 
'Create' | 'Basics' | 'Delete' | 'Check' | 'Input' | 'Output' | 'Input' | 'Script' | 'Sign' | 'Clear' | 'Post' | 'Import' | 'Export' | 'List'
// 14 cmds

interface TransactionConstructorInterface {
  id: number;
  command?: TypeTxnCommands;
  input?: InputInterface;
  output?: OutputInterface;
  script?: ScriptInterface;
  export?: ExportInterface;
  import?: ImportInterface;
  sign?: SignatureInterface;
}

interface ScriptInterface {
  scripts: object;
}
interface SignatureInterface {
  publickey: string;
}
interface InputInterface {
  coinid: string;
  coindata?: string;
  floating?: any; // TO-DO
  address?: string;
  amount?: string;
  tokenid?: string;
  scriptmmr?: boolean;
}
interface ExportInterface {
  file: string;
}
interface ImportInterface {
  file: string;
  data: string;
}
interface OutputInterface {
  amount: string;
  address: string;
  tokenid: string;
  storestate: boolean;
}

interface ScriptInterface {
  scripts: object;
}

export {TypeTxnCommands, TransactionConstructorInterface}