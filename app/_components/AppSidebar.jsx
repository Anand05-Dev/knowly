"use client";
import React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Compass, GalleryHorizontalEnd, LogIn, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignOutButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const MenuOption = [
    {
        title: "Home",
        icon: Search,
        path: "/",
    },
    {
        title: "Explore",
        icon: Compass,
        path: "/explore",
    },
    {
        title: "Library",
        icon: GalleryHorizontalEnd,
        path: "/library",
    },
    {
        title: "Sign-In",
        icon: LogIn,
        path: "/sign-in",
    },
];

export function AppSidebar() {
    const path = usePathname();
    const { user } = useUser();
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
                                    className={`p-5 py-6 hover:bg-transparent hover:font-bold ${path?.includes(menu.path) ? 'font-bold' : ''}`} >
                                    <a href={menu.path} className="">
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
                </SidebarContent>
                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter className="bg-accent">
                <div className="p-3 flex-col">
                    <h2 className="text-gray-800">Try Pro</h2>
                    <p className="text-gray-400"> Upgrade for image Upload,Smater AI & more Copilot</p>
                    <Button variant={'outline'} className="mx-10 mt-6 mb-3">Learn More</Button>
                    <UserButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}