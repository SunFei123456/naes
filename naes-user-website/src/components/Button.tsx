import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: ReactNode;
  to: string; // 跳转路径
}

const Button: FC<ButtonProps> = ({ children, to }) => {
  return (
    <Link to={to}>
      <button
        className="rounded-lg bg-[#204f3e] px-4 py-2 text-white shadow-md
                           transition hover:bg-[#1a3f32] active:scale-95"
      >
        {children}
      </button>
    </Link>
  );
};

export default Button;
