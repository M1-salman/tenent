import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { BillSchema } from "@/schemas";

interface Tenant {
  tenantId: string;
  firstName: string;
  lastName: string;
  monthlyRent: number;
  totalRooms: number;
  fix?: number;
  perUnit?: number;
  advance: number;
}

interface GenerateBillFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
}

export default function GenerateBillForm({
  open,
  onOpenChange,
  tenant,
}: GenerateBillFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [total, setTotal] = useState(0);

  // Handle dialog close by clearing success message
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSuccess("");
    }
    onOpenChange(open);
  };

  const form = useForm<z.infer<typeof BillSchema>>({
    resolver: zodResolver(BillSchema),
    defaultValues: {
      tenantId: tenant.tenantId,
      totalUnits: 0,
      electricityBill: 0,
      advance: tenant.advance,
      arrears: 0,
      startDate: new Date(),
      endDate: new Date(),
      billType: "Monthly",
      total: 0,
    },
  });

  // Update electricity bill when total units change
  const updateElectricityBill = (totalUnits: number) => {
    let electricityBill = 0;
    if (tenant.fix) {
      electricityBill = tenant.fix;
    } else if (tenant.perUnit) {
      electricityBill = tenant.perUnit * totalUnits;
    }
    form.setValue("electricityBill", electricityBill);
    return electricityBill;
  };

  // Update total bill
  const updateTotal = () => {
    const values = form.getValues();
    const electricityBill = values.electricityBill || 0;
    const arrears = values.arrears || 0;
    const advance = values.advance || 0;

    const newTotal = ((tenant.monthlyRent * tenant.totalRooms) + electricityBill + arrears) - advance;
    setTotal(newTotal);
    form.setValue("total", newTotal);
  };

  // Initialize calculations on mount
  useEffect(() => {
    const totalUnits = form.getValues().totalUnits || 0;
    updateElectricityBill(totalUnits);
    updateTotal();
  }, []);

  const onSubmit = async (values: z.infer<typeof BillSchema>) => {
    setError("");
    setSuccess("");
    setIsPending(true);

    try {
      // Format dates to YYYY-MM-DD
      const formattedValues = {
        ...values,
        startDate: values.startDate instanceof Date 
          ? values.startDate.toISOString().split('T')[0]
          : new Date(values.startDate).toISOString().split('T')[0],
        endDate: values.endDate instanceof Date 
          ? values.endDate.toISOString().split('T')[0]
          : new Date(values.endDate).toISOString().split('T')[0]
      };

      const response = await fetch(
        "http://localhost:3000/api/tenant/generate-bill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formattedValues),
        }
      );

      const data = await response.json();
      

      if (!response.ok) {
        setError(data.error || "Something went wrong!");
        return;
      }

      setSuccess("Bill generated successfully!");
      form.reset();
      
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-[#f7f8fa]"
        aria-labelledby="generate-bill-title"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle id="generate-bill-title">Generate Bill</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* Read-only tenant information */}
              <div className="space-y-2">
                <FormLabel id="tenant-name-label">Tenant Name</FormLabel>
                <Input
                  value={`${tenant.firstName} ${tenant.lastName}`}
                  disabled
                  className="bg-muted"
                  aria-labelledby="tenant-name-label"
                  aria-readonly="true"
                />
              </div>

              <div className="space-y-2">
                <FormLabel id="monthly-rent-label">Monthly Rent</FormLabel>
                <Input
                  value={`₹${tenant.monthlyRent}`}
                  disabled
                  className="bg-muted"
                  aria-labelledby="monthly-rent-label"
                  aria-readonly="true"
                />
              </div>

              <div className="space-y-2">
                <FormLabel id="total-rooms-label">Total Rooms</FormLabel>
                <Input
                  value={tenant.totalRooms}
                  disabled
                  className="bg-muted"
                  aria-labelledby="total-rooms-label"
                  aria-readonly="true"
                />
              </div>

              {/* Electricity billing section */}
              <div className="space-y-4" role="group" aria-labelledby="electricity-billing-label">
                <FormLabel id="electricity-billing-label">Electricity Billing</FormLabel>
                
                {tenant.fix && (
                  <FormField
                    control={form.control}
                    name="electricityBill"
                    render={() => (
                      <FormItem>
                        <FormLabel id="fixed-amount-label">Fixed Amount</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            type="number"
                            value={tenant.fix}
                            className="bg-muted"
                            aria-labelledby="fixed-amount-label"
                            aria-readonly="true"
                          />
                        </FormControl>
                        <FormMessage aria-live="polite" />
                      </FormItem>
                    )}
                  />
                )}
                
                {tenant.perUnit && (
                  <>
                    <FormField
                      control={form.control}
                      name="totalUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id="total-units-label">Total Units</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={field.value}
                              aria-labelledby="total-units-label"
                              onChange={(e) => {
                                const value = e.target.value === "" ? 0 : Number(e.target.value);
                                field.onChange(value);
                                updateElectricityBill(value);
                                updateTotal();
                              }}
                            />
                          </FormControl>
                          <FormMessage aria-live="polite" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="electricityBill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel id="electricity-bill-label">Electricity Bill</FormLabel>
                          <FormControl>
                            <Input
                              disabled
                              type="number"
                              value={field.value}
                              className="bg-muted"
                              aria-labelledby="electricity-bill-label"
                              aria-readonly="true"
                            />
                          </FormControl>
                          <FormMessage aria-live="polite" />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {!tenant.fix && !tenant.perUnit && (
                  <div className="p-3 bg-muted rounded-md text-muted-foreground text-sm" aria-live="polite">
                    No electricity billing configured for this tenant.
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="advance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="advance-payment-label">Advance Payment</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? 0 : Number(e.target.value);
                          field.onChange(value);
                          updateTotal();
                        }}
                        aria-labelledby="advance-payment-label"
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="arrears-label">Arrears</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? 0 : Number(e.target.value);
                          field.onChange(value);
                          updateTotal();
                        }}
                        aria-labelledby="arrears-label"
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="start-date-label">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : new Date(field.value).toISOString().split("T")[0]
                        }
                        onChange={(e) => {
                          field.onChange(new Date(e.target.value));
                        }}
                        aria-labelledby="start-date-label"
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="end-date-label">End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : new Date(field.value).toISOString().split("T")[0]
                        }
                        onChange={(e) => {
                          field.onChange(new Date(e.target.value));
                        }}
                        aria-labelledby="end-date-label"
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="bill-type-label">Bill Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        className="flex flex-col space-y-1"
                        aria-labelledby="bill-type-label"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Monthly" id="monthly-bill" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="monthly-bill">Monthly</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Final" id="final-bill" />
                          </FormControl>
                          <FormLabel className="font-normal" htmlFor="final-bill">Final</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel id="total-bill-label">Total Bill</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={total}
                        onChange={(e) => {
                          const value = e.target.value === "" ? 0 : Number(e.target.value);
                          setTotal(value);
                          field.onChange(value);
                        }}
                        aria-labelledby="total-bill-label"
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} aria-live="assertive" />
            <FormSuccess message={success} aria-live="assertive" />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#b593ff] hover:bg-[#d3c0fc] w-full"
                aria-label={isPending ? "Generating bill..." : "Generate Bill"}
              >
                {isPending ? "Generating..." : "Generate Bill"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
