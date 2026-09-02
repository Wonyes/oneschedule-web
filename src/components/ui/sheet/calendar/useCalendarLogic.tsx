import { format } from "date-fns";

import { cn } from "@/src/utils/cn";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { MonthConstant } from "@/src/constant/MonthConstant";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";

interface CalendarTDProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  $disabled?: boolean;
}

const CalendarTD = ({
  className,
  children,
  $disabled,
  ...props
}: CalendarTDProps) => {
  return (
    <td
      className={cn(
        `
        typo-body-2
        w-[40px]
        h-[40px]
        align-middle
        text-center
        border-none
        cursor-pointer
        text-secondary
        select-none
        `,

        className?.includes("sunday") && "text-rose-400 font-medium",

        className?.includes("saturday") && "text-sky-400 font-medium",

        className?.includes("impossible_select") &&
          `
          hover:bg-transparent
          `,

        $disabled &&
          `
          cursor-not-allowed
          opacity-25
          pointer-events-none
          `,

        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
};

const CalendarTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <table
      className="
      border-spacing-0
      table-fixed
      w-full
      max-w-[360px]
      "
    >
      {children}
    </table>
  );
};

const Day = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const isSelected =
    className?.includes("start-date") || className?.includes("end-date");

  const isRange = className?.includes("in-range");

  return (
    <div
      className={cn(
        `
        typo-caption-2
        w-full
        h-[40px]
        min-w-[40px]
        flex
        items-center
        justify-center
        rounded-lg
        transition-colors
        `,

        !isSelected && !isRange && "hover:bg-white/10 hover:text-foreground",

        isRange &&
          `
          bg-indigo-950/70
          text-indigo-200
          rounded-none
          `,

        isSelected &&
          `
          bg-indigo-600
          text-white
          font-semibold
          rounded-lg
          shadow-md
          shadow-indigo-600/30
          `,
      )}
    >
      {children}
    </div>
  );
};

export const useCalendarLogic = () => {
  const { today, currentDate, moveMonth } = useCalendarStore();

  const { form, updateForm } = useSheetStore();

  const getDateInfo = () => {
    const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      daysInMonth: lastDate.getDate(),
      firstDayOfWeek: firstDate.getDay(),
    };
  };

  const getDateStatus = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");

    const startDate = form.startDate;
    const endDate = form.endDate;

    const isStartDate =
      startDate && format(startDate, "yyyy-MM-dd") === formatted;

    const isEndDate = endDate && format(endDate, "yyyy-MM-dd") === formatted;

    const isInRange =
      startDate && endDate && date > startDate && date < endDate;

    return {
      isFuture: currentDate > date,
      isStartDate,
      isEndDate,
      isInRange,
    };
  };

  const getDateClasses = ({
    isStartDate,
    isEndDate,
    isInRange,
    isFuture,
  }: {
    isStartDate: boolean | null;
    isEndDate: boolean | null;
    isInRange: boolean | null;
    isFuture: boolean;
  }) => {
    const classes: string[] = [];

    if (isStartDate) {
      classes.push("start-date");
    }

    if (isEndDate) {
      classes.push("end-date");
    }

    if (isInRange) {
      classes.push("in-range");
    }

    if (isFuture) {
      classes.push("impossible_select");
    }

    return classes.join(" ");
  };

  const createWeekRow = (
    week: number,
    startDateNumber: number,
    firstDayOfWeek: number,
  ) => {
    const row: React.ReactElement[] = [];

    let datesAdded = 0;

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (week === 0 && dayOfWeek < firstDayOfWeek) {
        row.push(<td key={`empty-${week}-${dayOfWeek}`} />);

        continue;
      }

      const currentDateNumber = startDateNumber + datesAdded;

      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        currentDateNumber,
      );

      if (currentDateNumber > getDateInfo().daysInMonth) {
        row.push(<td key={`empty-${week}-${dayOfWeek}`} />);

        continue;
      }

      const dateStatus = getDateStatus(date);

      const classes = getDateClasses(dateStatus);

      const handleDateClick = (date: Date) => {
        const { startDate, endDate } = form;

        if (
          startDate &&
          !endDate &&
          format(startDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
        ) {
          return;
        }

        if (!startDate || endDate) {
          updateForm({
            startDate: date,
            endDate: null,
          });

          return;
        }

        if (date < startDate) {
          updateForm({
            startDate: date,
            endDate: startDate,
          });

          return;
        }

        updateForm({
          endDate: date,
        });
      };

      row.push(
        <CalendarTD
          key={`day-${currentDateNumber}`}
          className={classes}
          onClick={() => handleDateClick(date)}
          $disabled={dateStatus.isFuture}
        >
          <Day className={classes}>{currentDateNumber}</Day>
        </CalendarTD>,
      );

      datesAdded++;
    }

    return {
      element: <tr key={`week-${week}`}>{row}</tr>,

      datesAdded,
    };
  };

  const createCalendar = () => {
    let calendarDate = 1;

    const calendarRows: React.ReactElement[] = [];

    const { daysInMonth, firstDayOfWeek } = getDateInfo();

    for (let week = 0; calendarDate <= daysInMonth; week++) {
      const row = createWeekRow(week, calendarDate, firstDayOfWeek);

      calendarDate += row.datesAdded;

      calendarRows.push(row.element);
    }

    return (
      <CalendarTable>
        <thead>
          <tr>
            <CalendarTD className="sunday weekly text-rose-400 font-semibold">
              일
            </CalendarTD>

            <CalendarTD className="weekly text-muted font-medium">
              월
            </CalendarTD>

            <CalendarTD className="weekly text-muted font-medium">
              화
            </CalendarTD>

            <CalendarTD className="weekly text-muted font-medium">
              수
            </CalendarTD>

            <CalendarTD className="weekly text-muted font-medium">
              목
            </CalendarTD>

            <CalendarTD className="weekly text-muted font-medium">
              금
            </CalendarTD>

            <CalendarTD className="saturday weekly text-sky-400 font-semibold">
              토
            </CalendarTD>
          </tr>
        </thead>

        <tbody>{calendarRows}</tbody>
      </CalendarTable>
    );
  };

  const getMonthCalculation = () => {
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
    );

    const prevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );

    return {
      nextMonth,
      prevMonth,
    };
  };

  const getCurrentMonth = () => {
    const months = MonthConstant.map((month, index) => ({
      [`month${index + 1}`]: month,
    }));

    const currentMonthArr = months[today.getMonth()];

    return currentMonthArr[`month${today.getMonth() + 1}`];
  };

  const getFormattedDateRange = () => {
    const { startDate, endDate } = form;

    if (!startDate) {
      return null;
    }

    const start = format(startDate, "yyyy.MM.dd");

    if (!endDate) {
      return start;
    }

    const end = format(endDate, "yyyy.MM.dd");

    return `${start} ~ ${end}`;
  };

  return {
    createCalendar,
    getDateStatus,
    getDateInfo,
    moveMonth,
    getFormattedDateRange,
    ...getMonthCalculation(),
    currentMonth: getCurrentMonth(),
  };
};
