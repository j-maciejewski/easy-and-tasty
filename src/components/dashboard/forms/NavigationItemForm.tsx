"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";

const formSchema = z.object({
  label: z.string().min(2, {
    message: "Label must be at least 2 characters.",
  }),
  href: z.string().optional(),
});

export namespace NavigationItemForm {
  export interface Props {
    data?: {
      label: string;
      href?: string;
    };
    onSubmit: (values: { label: string; href?: string }) => void;
  }
}

export function NavigationItemForm({
  onSubmit,
  data,
}: NavigationItemForm.Props) {
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      onSubmit(values);
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying config.",
      );
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data
      ? {
          label: data.label,
          href: data.href,
        }
      : {
          label: "",
          href: "",
        },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="min-w-1 space-y-8"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="text-white">
          {data ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
