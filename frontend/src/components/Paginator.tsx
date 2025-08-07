import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Trước
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className={
            currentPage === page
              ? "bg-[#3333CC] text-white"
              : "hover:bg-gray-100"
          }
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Sau
      </Button>
    </div>
  );
};

export default Pagination;
