import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

interface SelectTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenants: Tenant[];
  onTenantSelect: (tenant: Tenant) => void;
}

export default function SelectTenantDialog({
  open,
  onOpenChange,
  tenants,
  onTenantSelect,
}: SelectTenantDialogProps) {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [focusIndex, setFocusIndex] = useState<number>(-1);

  const handleSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleConfirm = () => {
    if (selectedTenant) {
      onTenantSelect(selectedTenant);
      onOpenChange(false);
      setSelectedTenant(null);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number, tenant: Tenant) => {
    switch (e.key) {
      case "Enter":
      case " ": // Space key
        e.preventDefault();
        handleSelect(tenant);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusIndex((index + 1) % tenants.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusIndex((index - 1 + tenants.length) % tenants.length);
        break;
      default:
        break;
    }
  };
  
  // Focus the element when focusIndex changes
  useEffect(() => {
    if (focusIndex >= 0 && open) {
      const element = document.getElementById(`tenant-${focusIndex}`);
      if (element) {
        element.focus();
      }
    }
  }, [focusIndex, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-[#f7f8fa]"
        aria-labelledby="select-tenant-title"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader className="pb-4">
          <DialogTitle id="select-tenant-title">Select Tenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4" role="listbox" aria-label="Available tenants">
          {tenants.map((tenant, index) => (
            <div
              key={tenant.tenantId}
              id={`tenant-${index}`}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                selectedTenant?.tenantId === tenant.tenantId
                  ? "bg-[#b593ff] text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(tenant)}
              onKeyDown={(e) => handleKeyDown(e, index, tenant)}
              tabIndex={0}
              role="option"
              aria-selected={selectedTenant?.tenantId === tenant.tenantId}
              aria-label={`${tenant.firstName} ${tenant.lastName}${tenant.fix ? `, Fixed: ₹${tenant.fix}` : tenant.perUnit ? `, Per Unit: ₹${tenant.perUnit}` : ', No Electricity Billing'}`}
            >
              {tenant.image ? (
                <img
                  src={tenant.image}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                  aria-hidden="true"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted" aria-hidden="true">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div>
                <div className="font-medium">
                  {tenant.firstName} {tenant.lastName}
                </div>
                <div className="text-sm">
                  {tenant.fix
                    ? `Fixed: ₹${tenant.fix}`
                    : tenant.perUnit
                    ? `Per Unit: ₹${tenant.perUnit}`
                    : "No Electricity Billing"}
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="sticky bottom-0 bg-background pt-4">
          <Button
            onClick={handleConfirm}
            disabled={!selectedTenant}
            className="bg-[#b593ff] hover:bg-[#d3c0fc] w-full"
            aria-label="Confirm tenant selection"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 