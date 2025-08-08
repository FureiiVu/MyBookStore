interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeBarProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

export const DateRangeBar = ({
  dateRange,
  onDateChange,
}: DateRangeBarProps) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({ ...dateRange, startDate: new Date(e.target.value) });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange({ ...dateRange, endDate: new Date(e.target.value) });
  };

  const formatDateInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex items-end gap-4 mb-4">
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Từ ngày
        </label>
        <input
          type="date"
          value={formatDateInput(dateRange.startDate)}
          onChange={handleStartChange}
          className="border rounded px-3 py-2 text-sm bg-white"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Đến ngày
        </label>
        <input
          type="date"
          value={formatDateInput(dateRange.endDate)}
          onChange={handleEndChange}
          className="border rounded px-3 py-2 text-sm bg-white"
        />
      </div>
    </div>
  );
};
