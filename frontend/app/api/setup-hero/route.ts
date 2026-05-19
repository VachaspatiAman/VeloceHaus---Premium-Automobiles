import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const src = path.join(
      "C:\\Users\\spand\\.gemini\\antigravity\\brain\\e4924b12-e8e2-4f63-ba57-373994248a7a",
      "hero_lamborghini_1777284671865.png"
    );
    const dest = path.join(process.cwd(), "public", "Assets", "hero-car.png");

    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);

    return NextResponse.json({ success: true, dest });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
