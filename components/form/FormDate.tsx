"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { DateTimePicker } from "../ui/datetime-picker";

type DateProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

const FormDate: React.FC<DateProps> = ({ form, label, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name="dob"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <DateTimePicker
              value={field.value}
              onChange={field.onChange}
              hideTime={true}
              placeholder={placeholder}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDate;
