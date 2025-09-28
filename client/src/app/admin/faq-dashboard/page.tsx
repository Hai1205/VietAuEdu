"use client";

import { useCallback, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateFAQDialog from "@/components/common/admin/faqDashboard/UpdateFAQDialog";
import CreateFAQDialog from "@/components/common/admin/faqDashboard/CreateFAQDialog";
import { FAQFilter } from "@/components/common/admin/faqDashboard/FAQFilter";
import { FAQTable } from "@/components/common/admin/faqDashboard/FAQTable";
import { TableSearch } from "@/components/common/admin/TableSearch";
import { useFAQStore } from "@/utils/stores/faqStore";
import { DashboardHeader } from "@/components/common/admin/DashboardHeader";

// Initialize empty filters
const initialFilters = { status: [] as string[], contentType: [] as string[] };

export default function FAQDashboardPage() {
  const { isLoading, getAllFAQs, updateFAQ, createFAQ } = useFAQStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFAQOpen, setIsCreateFAQOpen] = useState(false);
  const [isUpdateFAQOpen, setIsUpdateFAQOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [allFAQs, setAllFAQs] = useState<IFAQ[] | []>([]);
  const [filteredFAQs, setFilteredFAQs] = useState<IFAQ[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllFAQs();
      const data = res?.data?.FAQs || [];
      setAllFAQs(data);
      setFilteredFAQs(data);
    };

    fetchData();
  }, [getAllFAQs]);

  // Function to filter data based on query and activeFilters
  const filterData = useCallback(
    (query: string, filters: { status: string[]; contentType: string[] }) => {
      let results = [...allFAQs];

      // Filter by search query
      if (query.trim()) {
        const searchTerms = query.toLowerCase().trim();
        results = results.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerms) ||
            faq.answer.toLowerCase().includes(searchTerms) ||
            faq.category.toLowerCase().includes(searchTerms)
        );
      }

      // Filter by status
      if (filters.status.length > 0) {
        results = results.filter((faq) =>
          filters.status.includes(faq.status || "")
        );
      }

      // Filter by contentType (category)
      if (filters.contentType.length > 0) {
        results = results.filter((faq) =>
          filters.contentType.includes(faq.category || "")
        );
      }

      setFilteredFAQs(results);
    },
    [allFAQs]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Filter data based on current searchQuery and activeFilters
      filterData(searchQuery, activeFilters);
    },
    [searchQuery, activeFilters, filterData]
  );

  // Toggle filter without auto-filtering
  const toggleFilter = (value: string, type: "status" | "contentType") => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (updated[type]?.includes(value)) {
        updated[type] = updated[type].filter((item) => item !== value);
      } else {
        updated[type] = [...(updated[type] || []), value];
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setActiveFilters(initialFilters);
    setSearchQuery("");
    setFilteredFAQs(allFAQs); // Reset filtered data
    closeMenuMenuFilters();
  };

  const applyFilters = () => {
    // Filter data based on current activeFilters and searchQuery
    filterData(searchQuery, activeFilters);
    closeMenuMenuFilters();
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

  const [data, setData] = useState<IFAQ | null>(null);

  const handleChange = (field: keyof IFAQ, value: string) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUpdate = async () => {
    if (data) {
      await updateFAQ(
        data._id,
        data.question,
        data.answer,
        data.category,
        data.status
      );

      // Refresh the FAQs list after update
      const res = await getAllFAQs();
      const updatedData = res?.data?.FAQs || [];
      setAllFAQs(updatedData);

      // Apply current filters
      filterData(searchQuery, activeFilters);

      setIsUpdateFAQOpen(false);
    }
  };

  const handleCreate = async () => {
    if (data) {
      await createFAQ(data.question, data.answer, data.category, data.status);

      // Refresh the FAQs list after create
      const res = await getAllFAQs();
      const updatedData = res?.data?.FAQs || [];
      setAllFAQs(updatedData);

      // Apply current filters
      filterData(searchQuery, activeFilters);

      setIsCreateFAQOpen(false);
      setData(null);
    }
  };

  return (
    <div className="space-y-4">
      <DashboardHeader
        title="FAQ Dashboard"
        onCreateClick={() => setIsCreateFAQOpen(true)}
        createButtonText="Create FAQ"
      />

      <CreateFAQDialog
        isOpen={isCreateFAQOpen}
        onOpenChange={setIsCreateFAQOpen}
        onChange={handleChange}
        onFAQCreated={handleCreate}
        data={data}
        isLoading={isLoading}
      />

      <UpdateFAQDialog
        isOpen={isUpdateFAQOpen}
        onOpenChange={setIsUpdateFAQOpen}
        onChange={handleChange}
        data={data}
        onFAQUpdated={handleUpdate}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle />

              <div className="flex items-center gap-2">
                <TableSearch
                  handleSearch={handleSearch}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search FAQs..."
                />

                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={async () => {
                    // Reset filters
                    setActiveFilters(initialFilters);
                    setSearchQuery("");

                    // Refresh data from API
                    const res = await getAllFAQs();
                    const data = res?.data?.FAQs || [];
                    setAllFAQs(data);
                    setFilteredFAQs(data);
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <FAQFilter
                  openMenuFilters={openMenuFilters}
                  setOpenMenuFilters={setOpenMenuFilters}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  clearFilters={clearFilters}
                  applyFilters={applyFilters}
                  closeMenuMenuFilters={closeMenuMenuFilters}
                />
              </div>
            </div>
          </CardHeader>

          <FAQTable
            FAQs={filteredFAQs}
            isLoading={isLoading}
            onEdit={(faq) => {
              setData(faq);
              setIsUpdateFAQOpen(true);
            }}
          />
        </Card>
      </div>
    </div>
  );
}
