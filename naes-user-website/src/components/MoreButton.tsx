const MoreButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      className="group inline-flex transform items-center py-2 text-xs font-semibold normal-case
            text-gray-500 transition-transform hover:translate-x-2 focus:translate-x-2 focus:outline-none focus:ring-0"
      onClick={onClick}
    >
      {children}
      <span className="ml-1">{'>'}</span>
    </button>
  );
};

export default MoreButton;
