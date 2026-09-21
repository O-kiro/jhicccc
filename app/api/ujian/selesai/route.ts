import { proxyPost } from "@/lib/api-proxy";

/**
 * Mengakhiri sesi CBT. Penilaian dikerjakan Laravel — kunci jawaban tidak
 * pernah sampai ke browser, jadi hanya server yang bisa menghitungnya.
 */
export async function POST() {
  return proxyPost("/exam-session/finish", {});
}
