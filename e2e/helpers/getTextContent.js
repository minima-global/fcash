async function getTextContent(page, selector) {
  const el = await page.$(selector);
  return await page.evaluate(el => el.textContent, el);
}

module.exports = getTextContent;
