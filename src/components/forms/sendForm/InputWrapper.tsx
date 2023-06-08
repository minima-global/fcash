import styled from "@emotion/styled";

const InputWrapper = styled("div")`
  display: flex;
  flex-direction: column;
`;
const InputWrapperRadio = styled("div")`
  display: flex;
  flex-direction: column;
  border: 1px solid #c1c1c7;
  padding: 13px 0;
  border-radius: 8px;

  > #radio-group {
    gap: 8px;
    padding: 2px 16px;
  }
  > #radio-group label {
    border: 1px solid #d3d3d3;
    border-radius: 8px;
    margin: 0;
    padding: 4px;
  }
`;
const InputLabel = styled("label")`
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
  font-size: 0.775rem;
  font-weight: 500;
  text-align: left;
  padding: 8px;
  padding-bottom: 0;
`;
export { InputWrapper, InputLabel, InputHelper, InputWrapperRadio };
