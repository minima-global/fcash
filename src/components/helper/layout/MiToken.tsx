import styled from "@emotion/styled";

export {
  MiSearchBar,
  MiSearchBarWithIcon,
  MiTokenName,
  MiTokenNameTicker,
  MiTokenAmount,
  MiSkeleton,
  MiTokenListItem,
  MiTokenContainer,
  NoResults,
};

const MiTokenContainer = styled("div")`
  margin-top: 16px;

  > :last-of-type {
    margin-bottom: 0;
  }
`;

const MiTokenListItem = styled("li")`
  background: #ffede9;
  margin-bottom: 8px;
  min-height: 72px;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  border: 1px solid #ffb9ab;
  overflow: hidden;

  * {
    padding: 0 8px;
    text-overflow: ellipsis;
    display: block;
  }
`;
const MiSearchBar = styled("input")`
  // margin-top: 22px;
  border: 1px solid #bdbdc4;
  border-radius: 8px;
  min-height: 48px;
  padding: 0px 16px;
  padding-right: 44px;

  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.01em;
  text-align: left;
  width: 100%;
`;
const MiSearchBarWithIcon = styled("div")`
  width: 100%;
  position: relative;
  & > svg {
    position: absolute;
    right: 16px;
    top: 14px;
    transition: 0.3s;
  }
`;

const MiTokenName = styled("p")`
  padding: 0;
  margin: 0;

  font-size: 0.875rem;
  font-weight: 700;
  line-height: 19px;
  letter-spacing: 0.02em;
  text-align: left !important;
  color: #ff6b4e;
  max-width: 35vw;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MiTokenNameTicker = styled("p")`
  padding: 0;
  margin: 0;
  font-size: 0.75rem;

  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: #363a3f;
  max-width: 35vw;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left !important;
`;
const MiTokenAmount = styled("p")`
  padding: 0;
  margin: 0;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.02em;
  font-variant: tabular-nums;
  color: #363a3f;
  max-width: 35vw;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
`;

const NoResults = styled("div")`
  margin-top: 50px;
  > h6 {
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 33px;
    color: #363a3f;
    padding: 0;
    margin: 0;
  }
  > p {
    margin: 0;
    padding: 0;
    margin-top: 15px;
    font-size: 0.938rem;
  }
  * {
    text-align: center;
    letter-spacing: 0.02em;
  }
`;

const MiSkeleton = styled("span")`
  padding: 0;
  margin: 0;
  line-height: 16px;
  letter-spacing: 0.02em;
  height: 10px;
`;
