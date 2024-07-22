import vine, { SimpleMessagesProvider } from "@vinejs/vine";
import { CustomErrorReporter } from "./customErrorReporter.js";
import { customErrorMessage } from "./customErrorMessages.js";

vine.errorReporter = () => new CustomErrorReporter();
vine.messagesProvider = new SimpleMessagesProvider(customErrorMessage);

export const RegisterSchema = vine.object({
  firstName: vine
    .string()
    .minLength(1)
    .maxLength(50)
    .regex(/^[A-Za-z]+$/),
  lastName: vine
    .string()
    .maxLength(50)
    .regex(/^[A-Za-z]+$/),
  email: vine.string().email(),
  password: vine
    .string()
    .minLength(6)
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/)
    .confirmed({
      confirmationField: "confirmPassword",
    }),
});
