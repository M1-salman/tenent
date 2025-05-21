import { useState } from "react";
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
import { TenantSchema } from "@/schemas";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateTenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ElectricityType = "fix" | "perUnit" | "none";

export default function CreateTenantForm({
  open,
  onOpenChange,
}: CreateTenantFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [electricityType, setElectricityType] =
    useState<ElectricityType>("none");

  // Handle dialog close by clearing success message
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSuccess("");
    }
    onOpenChange(open);
  };

  const form = useForm<z.infer<typeof TenantSchema>>({
    resolver: zodResolver(TenantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      monthlyRent: 0,
      totalRooms: 1,
      advance: 0,
      startDate: new Date(),
      endDate: undefined,
      fix: undefined,
      perUnit: undefined,
    },
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const onSubmit = async (values: z.infer<typeof TenantSchema>) => {
    setError("");
    setSuccess("");
    setIsPending(true);

    // Format dates to YYYY-MM-DD
    const formattedValues = {
      ...values,
      startDate: formatDate(values.startDate),
      endDate: values.endDate ? formatDate(values.endDate) : undefined,
      // Only include the selected electricity type
      fix: electricityType === "fix" ? values.fix : undefined,
      perUnit: electricityType === "perUnit" ? values.perUnit : undefined,
    };

    try {
      const response = await fetch("http://localhost:3000/api/tenant/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formattedValues),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong!");
        return;
      }

      setSuccess("Tenant created successfully!");
      form.reset();
      setElectricityType("none");
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-[#f7f8fa]">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center justify-between">
            Create New Tenant
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={isPending}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalRooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Rooms</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={isPending}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Electricity Billing</FormLabel>
                <RadioGroup
                  value={electricityType}
                  onValueChange={(value) =>
                    setElectricityType(value as ElectricityType)
                  }
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="fix" />
                    </FormControl>
                    <FormLabel className="font-normal">Fixed Amount</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="perUnit" />
                    </FormControl>
                    <FormLabel className="font-normal">Per Unit</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      No Electricity Billing
                    </FormLabel>
                  </FormItem>
                </RadioGroup>

                {electricityType === "fix" && (
                  <FormField
                    control={form.control}
                    name="fix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fixed Amount (₹)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isPending}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {electricityType === "perUnit" && (
                  <FormField
                    control={form.control}
                    name="perUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Per Unit Rate (₹)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            disabled={isPending}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="advance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Payment</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={isPending}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPending}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        value={
                          field.value
                            ? formatDate(field.value)
                            : formatDate(new Date())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPending}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        value={field.value ? formatDate(field.value) : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#b593ff] hover:bg-[#d3c0fc] w-full"
              >
                {isPending ? "Creating..." : "Create Tenant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
