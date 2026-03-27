/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const lowStock: any[] = await prisma.$queryRaw`
      SELECT * FROM get_low_stock_products(5)
    `

    const report: any[] = await prisma.$queryRaw`
      SELECT * FROM generate_stock_report()
    `

    return NextResponse.json({
      lowStock,
      totalInventoryValue: report[0]?.total_value || 0,
      totalUnits: Number(report[0]?.total_items || 0),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
