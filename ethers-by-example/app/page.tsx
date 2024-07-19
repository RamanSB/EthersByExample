"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";


const TITLE_SIGNATURE = "signatures";

export default function Home() {

  const router: AppRouterInstance = useRouter();

  const navigateToPage = (pageTitle: string) => {
    router.push(pageTitle);
  }

  return (
    <main className="p-4">
      <div className="card bg-primary text-primary-content w-96 ">
        <div className="card-body">
          <h2 className="card-title">Signatures</h2>
          <p>Explore examples demonstrating how to use Signatures in ethers.</p>
          <div className="flex mt-2">
            <button className="btn w-full" onClick={() => navigateToPage(TITLE_SIGNATURE)}>Explore</button>
          </div>
        </div>
      </div>
    </main>
  );
}
