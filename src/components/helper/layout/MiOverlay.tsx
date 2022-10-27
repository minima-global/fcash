import styled from "@emotion/styled";

const MiHeader = styled("h6")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 33px;
  text-align: center;
  letter-spacing: 0.02em;

  margin-top: 22px;
  margin-bottom: 17px;

  color: #363a3f;
`;

const MiContent = styled("p")`
  font-family: Manrope-regular;
  font-style: normal;
  font-weight: 500;
  font-size: 0.938rem;
  line-height: 24px;
  /* or 160% */

  text-align: center;
  letter-spacing: 0.02em;

  /* Text Colour / Black DM */

  color: #363a3f;

  padding: 0;
  margin: 0;
  margin-bottom: 48px;
`;

export { MiHeader, MiContent };
