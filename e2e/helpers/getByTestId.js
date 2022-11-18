function getByTestId(
  testId,
  { input = false, notDisabled = false } = { input: false, notDisabled: false }
) {
  if (input) {
    return `[data-testid="${testId}"] input`;
  }

  if (notDisabled) {
    return `[data-testid="${testId}"]:not([disabled])`;
  }

  return `[data-testid="${testId}"]`;
}

module.exports = getByTestId;
