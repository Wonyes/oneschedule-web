type Props = {
  text: string;
  icon?: React.ReactNode;
  isDisabled?: boolean;
};

const Primary = ({ text, icon, isDisabled }: Props) => {
  return (
    <div
      className={`w-fit h-fit rounded-[24px]
    ${isDisabled ? "bg-color-disable" : "bg-primary-500"}
    `}
    >
      <div className="flex gap-2 align-center justify-center">
        {icon && icon}
        <button
          disabled={isDisabled}
          className="px-[16px] py-[4px] text-white typo-body-2 disabled:cursor-not-allowed disabled-text-place-h"
        >
          {text}
        </button>
      </div>
    </div>
  );
};

const Secondary = ({ text, icon, isDisabled }: Props) => {
  return (
    <div
      className={`w-fit border h-fit rounded-[24px]
    ${isDisabled ? "border-disable" : "border-primary-500"}
    `}
    >
      <div className="flex gap-2 align-center justify-center">
        {icon && icon}
        <button
          disabled={isDisabled}
          className="px-[16px] py-[4px] text-primary-500 typo-body-2 disabled:cursor-not-allowed disabled-text-disable"
        >
          {text}
        </button>
      </div>
    </div>
  );
};

const Ghost = ({ text, icon, isDisabled }: Props) => {
  return (
    <div
      className={`w-fit border h-fit rounded-[24px]
    ${isDisabled ? "border-disable" : "border-primary"}
    `}
    >
      <div className="flex gap-2 align-center justify-center">
        {icon && icon}
        <button
          disabled={isDisabled}
          className="px-[16px] py-[4px] text-primary typo-body-2 disabled:cursor-not-allowed disabled-text-disable"
        >
          {text}
        </button>
      </div>
    </div>
  );
};

const WhiteGhost = ({ text, icon, isDisabled }: Props) => {
  return (
    <div
      className={`w-fit h-fit rounded-[24px]
    ${isDisabled ? "bg-color-disable" : "bg-transparent"}
    `}
    >
      <div className="flex gap-2 align-center justify-center">
        {icon && icon}
        <button
          disabled={isDisabled}
          className="px-[16px] py-[4px] text-primary-500 typo-body-2 disabled:cursor-not-allowed disabled-text-place-h"
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export { Primary, Secondary, Ghost, WhiteGhost };
