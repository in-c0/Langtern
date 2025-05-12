import { NextResponse } from "next/server"
import { supabase } from "@/config/db"

export async function GET() {
  try {
    const { data, error } = await supabase.from("languages").select("*").order("name")

    if (error) {
      return NextResponse.json({ message: "Failed to fetch languages" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Languages fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
