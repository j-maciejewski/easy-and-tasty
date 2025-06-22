"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AccountContent, NavigationContent, SeoContent } from "./_tabs";

export default function () {
  return (
    <Tabs defaultValue="account" className="mx-auto max-w-[48rem]">
      <TabsList className="mb-6 grid w-fit grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="navigation">Navigation</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <AccountContent />
      </TabsContent>
      <TabsContent value="seo">
        <SeoContent />
      </TabsContent>
      <TabsContent value="navigation">
        <NavigationContent />
      </TabsContent>
    </Tabs>
  );
}
