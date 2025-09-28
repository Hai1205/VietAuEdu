"use client";

import { useCallback, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useContactStore } from "@/utils/stores/contactStore";
import { useAuthStore } from "@/utils/stores/authStore";
import ContactDetailsDialog from "@/components/common/admin/contactDashboard/ContactDetailsDialog";
import { ContactTable } from "@/components/common/admin/contactDashboard/ContactTable";
import { TableSearch } from "@/components/common/admin/TableSearch";
import { ContactFilter } from "@/components/common/admin/contactDashboard/ContactFilter";
import { DashboardHeader } from "@/components/common/admin/DashboardHeader";

// Initialize empty filters
const initialFilters = { status: [] as string[] };

export default function ContactDashboardPage() {
  const { userAuth } = useAuthStore();
  const { isLoading, getAllContacts, respondContact } = useContactStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ status: string[] }>(
    initialFilters
  );
  const [allContacts, setAllContacts] = useState<IContact[] | []>([]);
  const [filteredContacts, setFilteredContacts] = useState<IContact[] | []>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllContacts();
      const data = res?.data?.contacts || [];
      setAllContacts(data);
      setFilteredContacts(data);
    };

    fetchData();
  }, [getAllContacts]);

  // Function to filter data based on query and activeFilters
  const filterData = useCallback(
    (query: string, filters: { status: string[] }) => {
      let results = [...allContacts];

      // Filter by search query
      if (query.trim()) {
        const searchTerms = query.toLowerCase().trim();
        results = results.filter(
          (contact) =>
            contact.name.toLowerCase().includes(searchTerms) ||
            contact.email.toLowerCase().includes(searchTerms) ||
            contact.phone.toLowerCase().includes(searchTerms) ||
            contact.message.toLowerCase().includes(searchTerms)
        );
      }

      // Filter by status
      if (filters.status.length > 0) {
        results = results.filter((contact) =>
          filters.status.includes(contact.status || "")
        );
      }

      setFilteredContacts(results);
    },
    [allContacts]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Filter data based on current searchQuery and activeFilters
      filterData(searchQuery, activeFilters);
    },
    [searchQuery, activeFilters, filterData]
  );

  const handleViewDetails = (contact: IContact) => {
    setSelectedContact(contact);
    setIsViewDetailsOpen(true);
  };

  const handleRespondContact = async () => {
    if (!selectedContact) {
      return;
    }

    if (!userAuth) {
      return;
    }

    setIsResponding(true);
    await respondContact(
      userAuth?._id,
      selectedContact.name,
      selectedContact.email,
      selectedContact.phone,
      message || ""
    );
    setIsResponding(false);

    setIsViewDetailsOpen(false);
  };

  // Toggle filter without auto-filtering
  const toggleFilter = (value: string, type: "status") => {
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
    setFilteredContacts(allContacts); // Reset filtered data
    closeMenuMenuFilters();
  };

  const applyFilters = () => {
    // Filter data based on current activeFilters and searchQuery
    filterData(searchQuery, activeFilters);
    closeMenuMenuFilters();
  };

  const [openMenuFilters, setOpenMenuFilters] = useState(false);
  const closeMenuMenuFilters = () => setOpenMenuFilters(false);

  const handleMessageChange = (value: string | null) => {
    setMessage(value);
  };

  return (
    <div className="space-y-4">
      <DashboardHeader title="Contact Dashboard" />

      {/* View Contact Details Dialog */}
      <ContactDetailsDialog
        isOpen={isViewDetailsOpen}
        onOpenChange={() => setIsViewDetailsOpen(false)}
        selectedContact={selectedContact}
        handleMessageChange={handleMessageChange}
        handleRespondContact={handleRespondContact}
        message={message}
        isResponding={isResponding}
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
                  placeholder="Search Contacts..."
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
                    const res = await getAllContacts();
                    const data = res?.data?.contacts || [];
                    setAllContacts(data);
                    setFilteredContacts(data);
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <ContactFilter
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

          <ContactTable
            contacts={filteredContacts}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        </Card>
      </div>
    </div>
  );
}
