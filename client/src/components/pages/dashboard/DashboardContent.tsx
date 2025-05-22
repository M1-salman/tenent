import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Download } from "lucide-react";
import CreateTenantForm from "./createTenantForm";
import SelectTenantDialog from "./SelectTenantDialog";
import GenerateBillForm from "./GenerateBillForm";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Tenant {
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  monthlyRent: number;
  image?: string;
  fix?: number;
  perUnit?: number;
  totalRooms: number;
  advance: number;
  startDate?: string;
  endDate?: string;
}

export default function DashboardContent() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [totalTenants, setTotalTenants] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSelectTenantDialogOpen, setIsSelectTenantDialogOpen] =
    useState(false);
  const [isGenerateBillFormOpen, setIsGenerateBillFormOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch tenants
        const tenantsResponse = await fetch(`${serverUrl}/api/tenant/get`, {
          headers,
        });
        if (!tenantsResponse.ok) throw new Error("Failed to fetch tenants");
        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData.data);
        setTotalTenants(tenantsData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTenantSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsGenerateBillFormOpen(true);
  };

  const handleExportToPDF = () => {
    // Create PDF in landscape mode for better fit
    const doc = new jsPDF("l", "mm", "a4");

    // Add title
    doc.setFontSize(16);
    doc.text("Tenants List", 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const tableData = tenants.map((tenant) => [
      `${tenant.firstName} ${tenant.lastName}`,
      tenant.email,
      tenant.phoneNumber,
      `Rs. ${tenant.monthlyRent}`,
      tenant.totalRooms.toString(),
      `Rs. ${tenant.advance}`,
      tenant.startDate
        ? new Date(tenant.startDate).toLocaleDateString()
        : "Not specified",
      tenant.endDate ? new Date(tenant.endDate).toLocaleDateString() : "Active",
      tenant.fix
        ? `Fixed: Rs. ${tenant.fix}`
        : tenant.perUnit
        ? `Per Unit: Rs. ${tenant.perUnit}`
        : "No electricity plan chosen",
    ]);

    // Create table
    autoTable(doc, {
      head: [
        [
          "Name",
          "Email",
          "Phone",
          "Monthly Rent",
          "Total Rooms",
          "Advance",
          "Start Date",
          "End Date",
          "Electricity",
        ],
      ],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      headStyles: {
        fillColor: [181, 147, 255],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Name
        1: { cellWidth: 40 }, // Email
        2: { cellWidth: 30 }, // Phone
        3: { cellWidth: 30 }, // Monthly Rent
        4: { cellWidth: 15 }, // Total Rooms
        5: { cellWidth: 20 }, // Advance
        6: { cellWidth: 20 }, // Start Date
        7: { cellWidth: 20 }, // End Date
        8: { cellWidth: 35 }, // Electricity
      },
      margin: { left: 10, right: 10 },
      didDrawPage: function (data) {
        // Add page numbers
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Save the PDF
    doc.save("tenants-list.pdf");
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="status"
        aria-label="Loading tenants"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading tenants...</span>
      </div>
    );
  }

  return (
    <>
      <Card className="mx-14 mb-14 bg-[#f7f8fa]">
        <CardHeader className="flex md:flex-row flex-col items-center justify-between">
          <div>
            <CardTitle>Tenants Overview</CardTitle>
            {totalTenants > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Total Tenants: {totalTenants}
              </p>
            )}
          </div>
          <div className="flex sm:flex-row  flex-col gap-2">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-[#b593ff] hover:bg-[#d3c0fc] sm:text-sm text-xs sm:px-4 px-3 sm:py-2 py-1.5 sm:h-10 h-8"
              aria-label="Create new tenant"
            >
              Create Tenant
            </Button>
            <Button
              onClick={() => setIsSelectTenantDialogOpen(true)}
              className="bg-[#b593ff] hover:bg-[#d3c0fc] sm:text-sm text-xs sm:px-4 px-3 sm:py-2 py-1.5 sm:h-10 h-8"
              aria-label="Generate bill for tenant"
            >
              Generate Bill
            </Button>
            <Button
              onClick={handleExportToPDF}
              className="bg-[#b593ff] hover:bg-[#d3c0fc] sm:text-sm text-xs sm:px-4 px-3 sm:py-2 py-1.5 sm:h-10 h-8"
              aria-label="Export tenants to PDF"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Tenants
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table aria-label="Tenants list">
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Electricity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.tenantId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tenant.image ? (
                        <img
                          src={tenant.image}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                          aria-hidden="true"
                        />
                      ) : (
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
                          aria-hidden="true"
                        >
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/tenant-profile/${tenant.tenantId}`}
                          className="font-medium hover:text-blue-500"
                        >
                          {tenant.firstName} {tenant.lastName}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {tenant.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tenant.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>₹{tenant.monthlyRent}</TableCell>
                  <TableCell>
                    {tenant.fix ? (
                      <span className="text-sm">Fixed: ₹{tenant.fix}</span>
                    ) : tenant.perUnit ? (
                      <span className="text-sm">
                        Per Unit: ₹{tenant.perUnit}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not specified
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {tenants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6"
                    aria-live="polite"
                  >
                    No tenants found. Create your first tenant to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateTenantForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <SelectTenantDialog
        open={isSelectTenantDialogOpen}
        onOpenChange={setIsSelectTenantDialogOpen}
        tenants={tenants}
        onTenantSelect={handleTenantSelect}
      />

      {selectedTenant && (
        <GenerateBillForm
          open={isGenerateBillFormOpen}
          onOpenChange={setIsGenerateBillFormOpen}
          tenant={selectedTenant}
        />
      )}
    </>
  );
}
