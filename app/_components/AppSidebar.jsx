"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Compass,
  GalleryHorizontalEnd,
  LogIn,
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { supabase } from "@/services/supabase";

const MenuOption = [
  { title: "Home", icon: Search, path: "/" },
  { title: "Explore", icon: Compass, path: "/explore" },
  { title: "Library", icon: GalleryHorizontalEnd, path: "/library" },
  { title: "Sign-In", icon: LogIn, path: "/sign-in" },
];

export function AppSidebar() {
  const path = usePathname();
  const { user } = useUser();
  const [credit, setCredit] = useState(0);
  const [subscription, setSubscription] = useState("free");

  const creditLimit = subscription === "pro" ? 5000 : 3;
  const creditAvailable = Math.max(credit, 0);
  const creditUsed = Math.max(creditLimit - creditAvailable, 0);
  const creditPercent = Math.min((creditUsed / creditLimit) * 100, 100);

  const fetchUserData = async () => {
    if (!user) return;

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("credit, subscription")
      .eq("email", email)
      .single();

    if (error) {
      return;
    }

    if (data) {
      setCredit(data.credit ?? 0);
      setSubscription(data.subscription?.toLowerCase() || "free");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) return;

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    // Show confirmation before triggering Razorpay
    const confirmedPayment = window.confirm("Proceed to pay ₹199 for Pro access?");
    if (!confirmedPayment) return;

    alert("🔧 Payment integration coming soon!\nPlease check back later.");
    return;

    // const options = {
    //   key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
    //   amount: 19900, // in paise = ₹199
    //   currency: "INR",
    //   name: "Your App Name",
    //   description: "Pro Plan - ₹199",
    //   handler: async function (response) {
    //     // On successful payment, update Supabase
    //     const { error } = await supabase
    //       .from("users")
    //       .update({ subscription: "pro", credit: 5000 })
    //       .eq("email", email);

    //     if (!error) {
    //       await fetchUserData(); // refresh state
    //     }
    //   },
    //   prefill: {
    //     name: user.fullName || "User",
    //     email: email,
    //   },
    //   theme: {
    //     color: "#3399cc",
    //   },
    // };

    // const razorpay = new window.Razorpay(options);
    // razorpay.open();
  };

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <SidebarHeader className="bg-sidebar p-4">
        <div className="bg-sidebar w-full flex items-center justify-center">
          <Image src="/logo1.png" alt="logo" width={180} height={20} />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-accent">
        <SidebarGroup />
        <SidebarContent>
          <SidebarMenu>
            {MenuOption.map((menu, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  className={`p-5 py-6 hover:bg-transparent hover:font-bold ${
                    path?.includes(menu.path) ? "font-bold" : ""
                  }`}
                >
                  <a href={menu.path}>
                    <menu.icon className="h-8 w-8" />
                    <span className="text-lg">{menu.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {!user ? (
            <SignUpButton mode="modal">
              <Button className="rounded-full mx-5 mt-4">Sign-Up</Button>
            </SignUpButton>
          ) : (
            <SignOutButton>
              <Button className="rounded-full mx-5 mt-4">Log-out</Button>
            </SignOutButton>
          )}

          {user && (
            <div className="mt-6 px-5">
              <p className="text-sm text-gray-800 mb-1">
                Subscription:{" "}
                <strong className="capitalize">{subscription}</strong>
              </p>

              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${creditPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-800 mt-1">
                {creditUsed} / {creditLimit} used
              </p>

              {creditUsed >= creditLimit && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  Limit reached — upgrade to Pro
                </p>
              )}
            </div>
          )}
        </SidebarContent>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter className="bg-accent">
        <div className="p-3 flex-col">
          <h2 className="text-gray-800">Try Pro</h2>
          <p className="text-gray-400">
            Upgrade for more credits, smarter AI, and more features.
          </p>
          <Button
            onClick={handleUpgrade}
            disabled={subscription === "pro"}
            variant={"outline"}
            className="mx-10 mt-6 mb-3"
          >
            {subscription === "pro" ? "Pro Active" : "Upgrade to Pro"}
          </Button>
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
