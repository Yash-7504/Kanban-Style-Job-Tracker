interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function PlusIcon({ width = 20, height = 20, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}