// A library that handles all things to do to create a transaction 

import { TransactionConstructorInterface } from "../types/txn";

import { rpc } from "../rpc-commands";


/** Create Transaction */

const txn = (params: TransactionConstructorInterface) => {

  switch(params.command) {

    case 'Create': // create a new txn

      rpc(`txncreate id:${params.id}`);
    break;
    case 'Input': // add inputs

      rpc(`txninput id:${params.id} coinid:${params.input?.coinid} ${params.input?.coindata ? 'coindata:'+params.input.coindata : ''} ${params.input?.floating ? 'floating:'+params.input.floating : ''} ${params.input?.address ? 'address:'+params.input.address : ''} ${params.input?.amount ? 'amount:'+params.input.amount : ''} ${params.input?.tokenid ? 'tokenid:'+params.input.tokenid : ''} ${params.input?.scriptmmr ? 'scriptmmr:'+params.input.scriptmmr : ''} `) 
    break;

    case 'Output': // add ouputs

      rpc(`txnoutput id:${params.id} amount:${params.output?.amount} address:${params.output?.address} tokenid:${params.output?.tokenid} storestate:${params.output?.storestate}`)
    break;
    case 'Script': // add scripts

      rpc(`txnscript id:${params.id} script:${params.script?.scripts}`);
    break;
    case 'Basics': // add mmr proofs 
    
      rpc(`txnbasics id:${params.id}`);
    break;
    case 'Sign': // sign txn

      rpc(`txnsign id:${params.id}`);
    break;
    case 'Post': // post it

      rpc(`txnpost id:${params.id}`);
    break;
    case 'Check': // check transaction/describe

      rpc(`txncheck id:${params.id}`);
    break;
    case 'Delete': // delete it

      rpc(`txndelete id:${params.id}`);
    break;
    case 'Clear': // clear all witness data

      rpc(`txnclear id:${params.id}`);
    break;
    case 'List':
      
      rpc(`txnlist`);
    break;
    case 'Export':

      rpc(`txnimport id:${params.id} file:${params.export?.file}`);
    break;
    case 'Import':

      rpc(`txnimport id:${params.id} file:${params.import?.file} data:${params.import?.data}`);
    break;
    default:
      console.log(`No default for txn`)
    break;
  }

}


export {txn};