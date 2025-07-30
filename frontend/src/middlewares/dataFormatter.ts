export const formatNumber = (value: string) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue ? `${Number(numericValue).toLocaleString("vi-VN")}đ` : "";
};

export const formatDateToDDMMYYYY = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
