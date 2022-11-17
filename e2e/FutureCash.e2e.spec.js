const session = require("../session.json");
// const helpers = require("./helpers");

describe('FutureCash - End to End', () => {
  beforeEach(async () => {
    await page.goto(session.MINIDAPP_APP_URL);
    await page.bringToFront();
  });

  it('should be titled "Future Cash"', async () => {
    await expect(page.title()).resolves.toMatch('Future Cash');
  });
});
