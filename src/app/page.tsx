import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { InitialProfile } from "@/lib/initial-profile";
import { User } from "@prisma/client";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default async function Home() {
  const session = await getServerSession()
  // if (!session) {
  //   redirect("/sign-in")
  // }

  const user = await InitialProfile() as User



  return (
    <>
      < div className="flex flex-col gap-3 w-full">
        <div className="font-bold text-3xl">
          Your Feed
        </div>
        <div className="flex flex-col">
          <div className=" flex font-semibold items-center gap-3 w-full text-lg bg-emerald-200 rounded-t-xl py-5 px-5">
            <FaHome size={25} />
            Home
          </div>
          <div className="border-solid border-[1px]  border-gray-200  py-3 pb-5 rounded-b-xl px-5">
            <p>Your Personalized home page</p>
            <div className=" flex justify-center w-full">
              <Link href="/r/create" className={buttonVariants({
                className: 'mt-3 bg-emerald-300 w-full rounded-xl justify-center text-lg text-black hover:bg-emerald-600  flex'
              })}>Create Community</Link>
            </div>
          </div>

        </div>

      </div >

    </>
  );
}
