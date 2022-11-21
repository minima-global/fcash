const session = require("../session.json");
const helpers = require("./helpers");

describe('FutureCash - End to End', () => {
  let secondPage;

  beforeAll(async () => {
    secondPage = await browser.newPage();
    await secondPage.goto(session.SECOND_MINIDAPP_APP_URL);

    // skips intro page for second instance
    await secondPage.waitForSelector(helpers.getByTestId('SplashScreen'));
    await page.bringToFront();
  });

  beforeEach(async () => {
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'write');
    await page.goto(session.MINIDAPP_APP_URL);
    await secondPage.goto(session.SECOND_MINIDAPP_APP_URL);
  });

  it('allows the user to skip the intro page', async () => {
    await page.waitForSelector(helpers.getByTestId('SplashScreen'), { visible: false });
    await page.waitForSelector(helpers.getByTestId('Intro__skip'), { timeout: 5000 });
    await page.click(helpers.getByTestId('Intro__skip'));

    await expect(page.$(helpers.getByTestId('App'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('should be titled "Future Cash"', async () => {
    await expect(page.title()).resolves.toMatch('Future Cash');
    console.log(expect.getState().currentTestName);
  });

  it('displays the splash screen the first time I open the app', async () => {
    await expect(page.$(helpers.getByTestId('SplashScreen'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });


  it('displays the menu', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));

    await expect(page.waitForSelector(helpers.getByTestId('Menu__balance'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays the balance (wallet)', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__balance'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__balance'));

    await expect(page.waitForSelector(helpers.getByTestId('Balance'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to search for a token by name on the balance page', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__balance'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__balance'));
    await page.waitForSelector(helpers.getByTestId('Balance'));

    await page.waitForSelector(helpers.getByTestId('Balance__input'));
    await page.type(helpers.getByTestId('Balance__input'), 'minima');

    await expect(page.waitForSelector(helpers.getByTestId('Balance__token__Minima'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to search for a token by id on the balance page', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__balance'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__balance'));
    await page.waitForSelector(helpers.getByTestId('Balance'));

    await page.waitForSelector(helpers.getByTestId('Balance__input'));
    await page.type(helpers.getByTestId('Balance__input'), '0x00');

    await expect(page.waitForSelector(helpers.getByTestId('Balance__token__Minima'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays no results message if no token could be matched by id or name', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__balance'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__balance'));
    await page.waitForSelector(helpers.getByTestId('Balance'));

    await page.waitForSelector(helpers.getByTestId('Balance__input'));
    await page.type(helpers.getByTestId('Balance__input'), 'DoesNotExist');

    await expect(page.$(helpers.getByTestId('Balance__token__Minima'))).resolves.toBeFalsy();
    console.log(expect.getState().currentTestName);
  });

  it('displays the current block information', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__currentBlock'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__currentBlock'));

    await expect(page.waitForSelector(helpers.getByTestId('MiCurrentBlockOverlay'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays the sending instructions', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__instructions'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__instructions'));

    await expect(page.waitForSelector(helpers.getByTestId('Instructions__send'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays the future instructions', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__instructions'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__instructions'));
    await page.click(helpers.getByTestId('Instructions__tabFuture'));

    await expect(page.waitForSelector(helpers.getByTestId('Instructions__future'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays the smart contract information', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__smartContract'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__smartContract'));

    await expect(page.waitForSelector(helpers.getByTestId('SmartContract'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays the you cant enter a date in the past', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await helpers.setTimeLock(page, 'past');

    await expect(page.waitForSelector('#datetime-helper-text')).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays "Invalid Address." if you enter an invalid address into the wallet address input field', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.type('#address', 'Invalid Address');

    await expect(helpers.getTextContent(page, '#address-helper-text')).resolves.toEqual('Invalid Address.');
    console.log(expect.getState().currentTestName);
  });

  it('displays "Invalid characters." if you enter an invalid amount into the amount input field', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.type('#amount', 'Invalid Amount');

    await expect(helpers.getTextContent(page, '#amount-helper-text')).resolves.toEqual('Invalid characters.');
    console.log(expect.getState().currentTestName);
  });

  it('clears the form fields if I click the cancel button', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.type('#address', 'Invalid Address');
    await page.type('#amount', 'Invalid Amount');

    await expect(helpers.getValue(page, '#address')).resolves.toEqual('Invalid Address');
    await expect(helpers.getValue(page,'#amount')).resolves.toEqual('Invalid Amount');
    await page.click(helpers.getByTestId('TokenTimeSelection__cancel'));

    await expect(helpers.getValue(page,'#address')).resolves.toEqual('');
    await expect(helpers.getValue(page,'#amount')).resolves.toEqual('');
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to send a minima coin to another user', async () => {
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));

    await expect(secondPage.waitForSelector(helpers.getByTestId('FutureCoins__pending__Minima'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to send a token to another user', async () => {
    const token = await helpers.createToken();
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiSelect'));
    await helpers.pause(1000);
    await page.waitForSelector(helpers.getByTestId(`MiSelect__token__${token}`), { timeout: 180000 });
    await page.click(helpers.getByTestId(`MiSelect__token__${token}`));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));

    await expect(secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__pending__${token}`), { timeout: 360000 })).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to send a nft to another user', async () => {
    const nft = await helpers.createNft();
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiSelect'));
    await helpers.pause(1000);
    await page.waitForSelector(helpers.getByTestId(`MiSelect__token__${nft}`), { timeout: 180000 });
    await page.click(helpers.getByTestId(`MiSelect__token__${nft}`));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));

    await expect(secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__pending__${nft}`), { timeout: 360000 })).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to send a minima coin to another user (read mode)', async () => {
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'read');
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await helpers.setTimeLock(page, 'future');
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));
    await helpers.pause(3000);
    await helpers.acceptPermissionRequest(session.MINIMA_RPC_URL, session.MINIDAPP_UID);

    await expect(secondPage.waitForSelector(helpers.getByTestId('FutureCoins__pending__Minima'))).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to send a token to another user (read mode)', async () => {
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'read');
    const token = await helpers.createToken();
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await helpers.setTimeLock(page, 'future');
    await page.click(helpers.getByTestId('MiSelect'));
    await helpers.pause(1000);
    await page.waitForSelector(helpers.getByTestId(`MiSelect__token__${token}`), { timeout: 180000 });
    await page.click(helpers.getByTestId(`MiSelect__token__${token}`));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));
    await helpers.pause(3000);
    await helpers.acceptPermissionRequest(session.MINIMA_RPC_URL, session.MINIDAPP_UID);

    await expect(secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__pending__${token}`), { timeout: 360000 })).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('allows the user to send a nft to another user (read mode)', async () => {
    await helpers.setAppPermission(session.MINIMA_RPC_URL, session.MINIDAPP_UID, 'read');
    const nft = await helpers.createNft();
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiSelect'));
    await helpers.setTimeLock(page, 'future');
    await helpers.pause(1000);
    await page.waitForSelector(helpers.getByTestId(`MiSelect__token__${nft}`), { timeout: 180000 });
    await page.click(helpers.getByTestId(`MiSelect__token__${nft}`));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));
    await helpers.pause(3000);
    await helpers.acceptPermissionRequest(session.MINIMA_RPC_URL, session.MINIDAPP_UID);

    await expect(secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__pending__${nft}`), { timeout: 360000 })).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays a contract that is to be claimed in the future', async () => {
    const nft = await helpers.createNft();
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiSelect'));
    await helpers.setTimeLock(page, 'near');
    await helpers.pause(1000);
    await page.waitForSelector(helpers.getByTestId(`MiSelect__token__${nft}`), { timeout: 180000 });
    await page.click(helpers.getByTestId(`MiSelect__token__${nft}`));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));

    await expect(secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__pending__${nft}`), { timeout: 360000 })).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });

  it('displays a contract that is to be claimable', async () => {
    const nft = await helpers.createNft();
    const walletAddress = await helpers.getWalletAddress(session.SECOND_MINIMA_RPC_URL);

    await secondPage.waitForSelector(helpers.getByTestId('App'));
    await secondPage.click(helpers.getByTestId('MiNavigation__future'));

    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiSelect'));
    await helpers.setTimeLock(page, 'near');
    await helpers.pause(1000);
    await page.waitForSelector(helpers.getByTestId(`MiSelect__token__${nft}`), { timeout: 180000 });
    await page.click(helpers.getByTestId(`MiSelect__token__${nft}`));
    await page.type('#address', walletAddress);
    await page.type('#amount', '1');
    await page.waitForSelector(helpers.getByTestId('TokenTimeSelection__send', { notDisabled:  true }));
    await page.click(helpers.getByTestId('TokenTimeSelection__send'));
    await page.waitForSelector(helpers.getByTestId('Confirmation__confirm'));
    await page.click(helpers.getByTestId('Confirmation__confirm'));

    await secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__pending__${nft}`), { timeout: 360000 });
    await secondPage.click(helpers.getByTestId('FutureCoins__readyTab'));
    await expect(secondPage.waitForSelector(helpers.getByTestId(`FutureCoins__ready__${nft}`), { timeout: 360000 })).resolves.toBeTruthy();
    console.log(expect.getState().currentTestName);
  });
});
