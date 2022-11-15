interface IProps {
  color?: string;
  size: number;
}
const MiInstructions = ({ color = "#16181C", size }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
    >
      <path
        d="M3.925 14.025H10.8V12.525H3.925V14.025ZM3.925 9.75H14.075V8.25H3.925V9.75ZM3.925 5.475H14.075V3.975H3.925V5.475ZM1.5 18C1.1 18 0.75 17.85 0.45 17.55C0.15 17.25 0 16.9 0 16.5V1.5C0 1.1 0.15 0.75 0.45 0.45C0.75 0.15 1.1 0 1.5 0H16.5C16.9 0 17.25 0.15 17.55 0.45C17.85 0.75 18 1.1 18 1.5V16.5C18 16.9 17.85 17.25 17.55 17.55C17.25 17.85 16.9 18 16.5 18H1.5ZM1.5 16.5H16.5V1.5H1.5V16.5ZM1.5 1.5V16.5V1.5Z"
        fill={color}
      />
    </svg>
  );
};

export default MiInstructions;
