import { z } from "zod";

export const bookingSchema = z.object({
  pitchId: z.string().min(1, "Pitch ID is required"),
  date: z.string().min(1, "Date is required"),
  slot: z.string().min(1, "Slot is required"),
});

export const reserveSlotSchema = z.object({

  pitchId: z
    .string()
    .min(1, "Pitch id required"),

  date: z
    .string()
    .min(1, "Date required"),

  slot: z
    .string()
    .min(1, "Slot required")

});