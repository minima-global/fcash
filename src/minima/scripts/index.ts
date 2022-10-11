

const futureCashScript = "RETURN @BLOCK GTE PREVSTATE(1) AND VERIFYOUT(@INPUT PREVSTATE(2) @AMOUNT @TOKENID FALSE)"



export {futureCashScript};