import { ScriptExecution } from "@/components/home/scriptExecution";
import { ProfileMenu } from "@/components/user/profileMenu";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="flex mx-auto max-w-7xl justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tools Admin Dashboard</h1>
        <ProfileMenu />
      </div>

      <div className="mx-auto max-w-7xl">
        <ScriptExecution />
      </div>
    </main>
  );
}
