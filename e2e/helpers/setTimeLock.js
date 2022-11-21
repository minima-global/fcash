const getValue = require("./getValue");
const { format, add, sub } = require("date-fns");

async function setTimeLock(page, state = undefined) {
  let date = '';

  const value = await getValue(page, '#datetime');

  if (state === 'future') {
    date = add(new Date(value), { minutes: 20 });
  } else if (state === 'near') {
    date = add(new Date(value), { minutes: 0 });
  } else if (state === 'past') {
    date = sub(new Date(value), { minutes: 20 });
  }

  const target = `${format(date, 'hh')}${format(date, 'mm')}${format(date, 'aaaaa')}`;

  await page.focus('#datetime');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.type('#datetime', target);
}

module.exports = setTimeLock;
