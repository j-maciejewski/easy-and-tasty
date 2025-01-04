"use client";

import { AddRecipeForm } from "../../_components/AddRecipeForm";

export default function RecipesDashboard() {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto px-6 py-8">
        <AddRecipeForm />
      </div>
    </main>
  );
}
