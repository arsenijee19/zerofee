import { ZeroFeeApp } from "@/components/zerofee-app";
import { getSeedState } from "@/lib/domain/seed";

export default function Page() {
  return <ZeroFeeApp initialState={getSeedState()} />;
}
