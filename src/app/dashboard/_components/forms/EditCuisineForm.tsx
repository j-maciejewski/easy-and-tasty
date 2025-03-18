"use client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import { Path } from "@/config";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

namespace EditCuisineForm {
  export interface Props {
    cuisineId: number;
    onSubmit?: () => void;
  }
}

export function EditCuisineForm({
  cuisineId,
  onSubmit,
}: EditCuisineForm.Props) {
  const { data, error, isLoading } =
    api.protected.cuisine.getCuisine.useQuery(cuisineId);

  const editCuisine = api.protected.cuisine.editCuisine.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: data
      ? {
          name: data.name,
          slug: data.slug,
          description: data.description,
        }
      : {
          name: "",
          slug: "",
          description: "",
        },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await editCuisine.mutateAsync({ id: cuisineId, ...values });

      toast.success("Cuisine was modified.");

      onSubmit?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while modifying the cuisine.",
      );
    }
  }

  if (isLoading)
    return <LoaderCircle className="mx-auto my-2 animate-spin text-gray-500" />;

  if (!data) redirect(Path.DASHBOARD_RECIPES);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="min-w-1 space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="text-white">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
