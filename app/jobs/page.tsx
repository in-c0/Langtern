"use client"

import { JobSearch } from "@/components/job-search"

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Job Search</h1>
      <JobSearch />
    </div>
  )
}
