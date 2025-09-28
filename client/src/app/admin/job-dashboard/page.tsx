"use client";

import { useCallback, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateJobDialog from "@/components/common/admin/jobDashboard/UpdateJobDialog";
import CreateJobDialog from "@/components/common/admin/jobDashboard/CreateJobDialog";
import { JobFilter } from "@/components/common/admin/jobDashboard/JobFilter";
import { JobTable } from "@/components/common/admin/jobDashboard/JobTable";
import { TableSearch } from "@/components/common/admin/TableSearch";
import { useJobStore } from "@/utils/stores/jobStore";
import { EStatus } from "@/utils/types/enum";
import { DashboardHeader } from "@/components/common/admin/DashboardHeader";

// Initialize empty filters
const initialFilters = { status: [] as string[], contentType: [] as string[] };

export default function JobDashboardPage() {
  const { isLoading, getAllJobs, updateJob, createJob } = useJobStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isUpdateJobOpen, setIsUpdateJobOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [allJobs, setAllJobs] = useState<IJob[] | []>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllJobs();
      const data = res?.data?.jobs || [];
      setAllJobs(data);
      setFilteredJobs(data);
    };

    fetchData();
  }, [getAllJobs]);

  // Function to filter data based on query and activeFilters
  const filterData = useCallback(
    (query: string, filters: { status: string[]; contentType: string[] }) => {
      let results = [...allJobs];

      // Filter by search query
      if (query.trim()) {
        const searchTerms = query.toLowerCase().trim();
        results = results.filter(
          (job) =>
            job.title.toLowerCase().includes(searchTerms) ||
            job.description.toLowerCase().includes(searchTerms) ||
            job.country.toLowerCase().includes(searchTerms)
        );
      }

      // Filter by status
      if (filters.status.length > 0) {
        results = results.filter((job) =>
          filters.status.includes(job.status || "")
        );
      }

      // Filter by contentType
      if (filters.contentType.length > 0) {
        results = results.filter((job) =>
          filters.contentType.includes(job.workType || "")
        );
      }

      setFilteredJobs(results);
    },
    [allJobs]
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
    setFilteredJobs(allJobs); // Reset filtered data
    closeMenuMenuFilters();
  };

  const applyFilters = () => {
    // Filter data based on current activeFilters and searchQuery
    filterData(searchQuery, activeFilters);
    closeMenuMenuFilters();
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

  // Use extended type for job data
  type ExtendedJobData = IJob & { image?: File | null };
  const [data, setData] = useState<ExtendedJobData | null>(null);

  const handleChange = (
    field: keyof ExtendedJobData,
    value: string | number | boolean | string[] | File | null
  ) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUpdate = async () => {
    if (data) {
      try {
        // Ensure all fields are of the correct types
        const positions =
          typeof data.positions === "number"
            ? data.positions
            : parseInt(data.positions as unknown as string) || 0;
        const featured =
          typeof data.featured === "boolean"
            ? data.featured
            : data.featured === "true";
        const requirements = Array.isArray(data.requirements)
          ? data.requirements
          : [];
        const benefits = Array.isArray(data.benefits) ? data.benefits : [];

        // Determine whether to use new image file or existing URL
        const imageToUse =
          data.image instanceof File ? data.image : data.imageUrl || "";

        // Direct call to the updateJob function with the optional question parameter
        await updateJob(
          data._id,
          data.title || "",
          data.country || "",
          imageToUse, // Use new file or existing URL
          positions,
          data.location || "",
          data.salary || "",
          data.applicationDeadline || "",
          data.estimatedDeparture || "",
          requirements,
          benefits,
          data.description || "Job description",
          data.company || "",
          data.workType || "",
          featured,
          data.workingHours || "",
          data.overtime || "",
          data.accommodation || "",
          data.workEnvironment || "",
          data.trainingPeriod || "",
          data.status || EStatus.ACTIVE,
          data.description || "" // Optional question parameter
        );

        // Refresh the jobs list after update
        const res = await getAllJobs();
        const updatedData = res?.data?.jobs || [];
        setAllJobs(updatedData);

        // Apply current filters
        filterData(searchQuery, activeFilters);

        // Close the dialog
        setIsUpdateJobOpen(false);
      } catch (error) {
        console.error("Error updating job:", error);
      }
    }
  };

  const handleCreate = async () => {
    if (data) {
      try {
        // Ensure all fields are of the correct types
        const positions =
          typeof data.positions === "number"
            ? data.positions
            : parseInt(data.positions as unknown as string) || 0;
        const featured =
          typeof data.featured === "boolean"
            ? data.featured
            : data.featured === "true";
        const requirements = Array.isArray(data.requirements)
          ? data.requirements
          : [];
        const benefits = Array.isArray(data.benefits) ? data.benefits : [];

        // Use image file if available
        const imageFile = data.image instanceof File ? data.image : null;

        await createJob(
          data.description || "Job description", // question parameter
          data.title || "",
          data.country || "",
          imageFile, // Pass image file if available
          positions,
          data.location || "",
          data.salary || "",
          data.applicationDeadline || "",
          data.estimatedDeparture || "",
          requirements,
          benefits,
          data.description || "",
          data.company || "",
          data.workType || "",
          featured,
          data.workingHours || "",
          data.overtime || "",
          data.accommodation || "",
          data.workEnvironment || "",
          data.trainingPeriod || "",
          data.status || EStatus.ACTIVE
        );

        // Refresh the jobs list after create
        const res = await getAllJobs();
        const updatedData = res?.data?.jobs || [];
        setAllJobs(updatedData);

        // Apply current filters
        filterData(searchQuery, activeFilters);

        // Close the dialog and reset the form
        setIsCreateJobOpen(false);
        setData(null);
      } catch (error) {
        console.error("Error creating job:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <DashboardHeader
        title="Job Dashboard"
        onCreateClick={() => setIsCreateJobOpen(true)}
        createButtonText="Create Job"
      />

      <CreateJobDialog
        isOpen={isCreateJobOpen}
        onOpenChange={setIsCreateJobOpen}
        onChange={handleChange}
        onJobCreated={handleCreate}
        data={data}
        isLoading={isLoading}
      />

      <UpdateJobDialog
        isOpen={isUpdateJobOpen}
        onOpenChange={setIsUpdateJobOpen}
        onChange={handleChange}
        data={data}
        onJobUpdated={handleUpdate}
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
                  placeholder="Search Jobs..."
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
                    const res = await getAllJobs();
                    const data = res?.data?.jobs || [];
                    setAllJobs(data);
                    setFilteredJobs(data);
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <JobFilter
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

          <JobTable
            Jobs={filteredJobs}
            isLoading={isLoading}
            onEdit={(job) => {
              setData(job);
              setIsUpdateJobOpen(true);
            }}
          />
        </Card>
      </div>
    </div>
  );
}
