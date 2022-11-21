async function getValue(page, selector) {
  const el = await page.$(selector);
  return await page.evaluate(el => el.value, el);
}

module.exports = getValue;
