type Props = {
  text: string | number;
  color?: "pink" | "yellow" | "primary" | "mint";
};

const colorMap = {
  pink: "bg-gradient-pink",
  yellow: "bg-gradient-yellow",
  primary: "bg-gradient-primary",
  mint: "bg-gradient-mint",
};

export const Labels = ({ text, color = "pink" }: Props) => {
  return (
    <div
      className={`w-fit h-fit  rounded-[12px] shadow-float ${colorMap[color]}`}
    >
      <button className="px-[12px] py-[4px] text-white typo-body-1">
        {text}
      </button>
    </div>
  );
};
