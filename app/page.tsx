import { ZeroFeeApp } from "@/components/zerofee-app";
import { getRuntimeState } from "@/lib/server/app-state";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <ZeroFeeApp initialState={await getRuntimeState()} />;
}
