const session = require("../session.json");
const helpers = require("./helpers");

describe('FutureCash - End to End', () => {
  beforeEach(async () => {
    await page.goto(session.MINIDAPP_APP_URL);
    await page.bringToFront();
  });

  it('should be titled "Future Cash"', async () => {
    await expect(page.title()).resolves.toMatch('Future Cash');
  });

  it('displays the splash screen the first time I open the app', async () => {
    await expect(page.$(helpers.getByTestId('SplashScreen'))).resolves.toBeTruthy();
  });

  it('allows the user to skip the intro page', async () => {
    await page.waitForSelector(helpers.getByTestId('SplashScreen'), { visible: false });
    await page.waitForSelector(helpers.getByTestId('Intro__skip'));
    await page.click(helpers.getByTestId('Intro__skip'));
    await expect(page.$(helpers.getByTestId('App'))).resolves.toBeTruthy();
  });

  it('displays the menu', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await expect(page.waitForSelector(helpers.getByTestId('Menu__balance'))).resolves.toBeTruthy();
  });

  it('displays the balance (wallet)', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__balance'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__balance'));
    await expect(page.waitForSelector(helpers.getByTestId('Balance'))).resolves.toBeTruthy();
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
  });

  it('displays the current block information', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__currentBlock'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__currentBlock'));
    await expect(page.waitForSelector(helpers.getByTestId('MiCurrentBlockOverlay'))).resolves.toBeTruthy();
  });

  it('displays the sending instructions', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__instructions'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__instructions'));
    await expect(page.waitForSelector(helpers.getByTestId('Instructions__send'))).resolves.toBeTruthy();
  });

  it('displays the future instructions', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__instructions'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__instructions'));
    await page.click(helpers.getByTestId('Instructions__tabFuture'));
    await expect(page.waitForSelector(helpers.getByTestId('Instructions__future'))).resolves.toBeTruthy();
  });

  it('displays the smart contract information', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__smartContract'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__smartContract'));
    await expect(page.waitForSelector(helpers.getByTestId('SmartContract'))).resolves.toBeTruthy();
  });

  it('displays the you cant enter a date in the past', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.focus('#datetime');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.type('#datetime', '00');
    await expect(page.waitForSelector('#datetime-helper-text')).resolves.toBeTruthy();
  });

  it('displays "Invalid Address." if you enter an invalid address into the wallet address input field', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.type('#address', 'Invalid Address');
    await expect(helpers.getTextContent(page, '#address-helper-text')).resolves.toEqual('Invalid Address.');
  });

  it('displays "Invalid characters." if you enter an invalid amount into the amount input field', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.type('#amount', 'Invalid Amount');
    await expect(helpers.getTextContent(page, '#amount-helper-text')).resolves.toEqual('Invalid characters.');
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
  });
});
