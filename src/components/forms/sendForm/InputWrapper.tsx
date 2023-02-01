import styled from "@emotion/styled";

const InputWrapper = styled("div")`
  display: flex;
  flex-direction: column;
`;
const InputLabel = styled("label")`
  font-family: Manrope-regular;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 21px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #ff7358;
  margin-left: 16px;
  margin-bottom: 4px;
`;
const InputHelper = styled("div")`
  font-family: Manrope-regular;
  font-size: 0.775rem;
  font-weight: 500;
  text-align: left;
  padding: 8px;
  padding-bottom: 0;
`;
export { InputWrapper, InputLabel, InputHelper };
