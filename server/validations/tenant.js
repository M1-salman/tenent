import vine, { SimpleMessagesProvider } from "@vinejs/vine";
import { CustomErrorReporter } from "./customErrorReporter.js";
import { customErrorMessage } from "./customErrorMessages.js";

vine.errorReporter = () => new CustomErrorReporter();
vine.messagesProvider = new SimpleMessagesProvider(customErrorMessage);

export const TenantSchema = vine.object({
  firstName: vine
    .string()
    .minLength(1)
    .maxLength(50)
    .regex(/^[A-Za-z]+$/),
  lastName: vine
    .string()
    .minLength(1)
    .maxLength(50)
    .regex(/^[A-Za-z]+$/),
  email: vine.string().email(),
  phoneNumber: vine
    .string()
    .minLength(7)
    .maxLength(15)
    .regex(/^\+?[0-9 ]+$/),
  monthlyRent: vine.number().min(0),
  totalRooms: vine.number().min(1),
  fix: vine.number().optional(),
  perUnit: vine.number().optional(),
  advance: vine.number().min(0),
  startDate: vine.date(),
  endDate: vine.date().optional(),
});


export const BillSchema = vine.object({
  tenantId: vine.string(),
  totalUnits: vine.number().min(0).optional(),
  electricityBill: vine.number().min(0),
  advance: vine.number().min(0),
  arrears: vine.number().min(0),
  startDate: vine.date(),
  endDate: vine.date(),
  billType: vine.string(),
  total: vine.number().min(0),
});
