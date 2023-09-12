export const UserIcon = ({ color }: { color: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21">
    <circle cx="9.99996" cy="5.50002" r="3.33333" className={`fill-${color}`} />
    <path
      d="M16.6667 15.0833C16.6667 17.1544 16.6667 18.8333 10 18.8333C3.33337 18.8333 3.33337 17.1544 3.33337 15.0833C3.33337 13.0122 6.31814 11.3333 10 11.3333C13.6819 11.3333 16.6667 13.0122 16.6667 15.0833Z"
      className={`fill-${color}`}
    />
  </svg>
);
