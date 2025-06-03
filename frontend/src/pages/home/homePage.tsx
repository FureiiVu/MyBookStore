import BookFilter from "@/components/BookFilter";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

function HomePage() {
  const isMobile = false;
  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full"
      >
        {/* Filter Section */}
        <ResizablePanel
          defaultSize={15}
          minSize={isMobile ? 0 : 10}
          maxSize={20}
          className="bg-white p-4 my-4 ml-4 rounded-md shadow-md"
        >
          <BookFilter />
        </ResizablePanel>

        <ResizableHandle className="w-3 bg-[#e9ecef]" />

        {/* Book List Section */}
        <ResizablePanel
          defaultSize={isMobile ? 100 : 85}
          className="bg-white p-4 my-4 mr-4 rounded-md shadow-md"
        >
          Book List Section
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

export default HomePage;
