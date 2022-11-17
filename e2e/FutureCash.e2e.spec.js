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

  it('displays the balance (wallet)', async () => {
    await page.waitForSelector(helpers.getByTestId('App'));
    await page.click(helpers.getByTestId('MiNavigation__menu'));
    await page.waitForSelector(helpers.getByTestId('Menu__balance'));
    await helpers.pause(1000);
    await page.click(helpers.getByTestId('Menu__balance'));
    await expect(page.waitForSelector(helpers.getByTestId('Balance'))).resolves.toBeTruthy();
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
});
