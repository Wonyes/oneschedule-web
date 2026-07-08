type Props = {
  text: string | number;
  className?: string;
};

export const Labels = ({ text, className = "" }: Props) => {
  return (
    <div
      className={`
        w-fit
        h-fit
        rounded-[4px]
        flex
        items-center
        justify-center
        ${className}
      `}
    >
      <span
        className="
          px-[4px]
          py-[2px]
          text-center
          typo-caption-2
        "
      >
        {text}
      </span>
    </div>
  );
};
