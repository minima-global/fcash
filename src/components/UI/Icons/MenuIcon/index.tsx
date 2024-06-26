const MenuIcon = ({ fill, size =22, extraClass }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={extraClass}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke={fill}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 6v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2z" />
    <path d="M20 15h-16" />
    <path d="M14 10l-2 -2l-2 2" />
  </svg>
);

export default MenuIcon;