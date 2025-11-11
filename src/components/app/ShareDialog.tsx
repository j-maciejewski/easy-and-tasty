"use client";

import { Check, Copy, Facebook, Share2, Twitter } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

export interface ShareDialogProps {
  shareConfig: {
    path: string;
    text: string;
    type: "recipe" | "article";
  };
}

export const ShareDialog = ({ shareConfig }: ShareDialogProps) => {
  const { path, type, text } = shareConfig;
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}${path}`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl,
      )}&quote=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl,
      )}&text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" className="size-6">
              <Share2 className="absolute size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Share {type === "recipe" ? "recipe" : "article"}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="flex flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Share {type === "recipe" ? "recipe" : "article"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <Input value={shareUrl} readOnly />
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex flex-wrap space-x-4 sm:justify-between">
          <Button
            onClick={shareOnFacebook}
            className="flex items-center space-x-2"
          >
            <Facebook className="h-5 w-5" />
            <span className="max-sm:hidden">Share on Facebook</span>
          </Button>
          <Button
            onClick={shareOnTwitter}
            className="flex items-center space-x-2"
          >
            <Twitter className="h-5 w-5" />
            <span className="max-sm:hidden">Share on Twitter</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
