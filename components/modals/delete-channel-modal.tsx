"use client";
import * as z from "zod";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  // Capture the server name
  const channelName = channel?.name || "";

  // Define schema with server name validation
  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: "Channel Name is Required",
      })
      .refine((name) => name === channelName, {
        message: `Channel name must match "${channelName}" exactly.`,
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`, 
        query: {
          serverId: server?.id,
        }
      })
      await axios.delete(url);
      onClose();
      // router.refresh();
      router.push(`/servers/${server?.id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setIsLoading(false);
    onClose();
    router.push(`/servers/${server?.id}`);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to Delete this Channel? <br />{" "}
            <span className="font-semibold text-indigo-500 select-none">#{channelName}</span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Type &quot;{channelName}&quot; to confirm your action.
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <Button disabled={isLoading} onClick={handleClose} variant="ghost">
                  Cancel
                </Button>
                <Button disabled={isLoading} variant="primary" type="submit">
                  Confirm
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
