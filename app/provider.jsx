"use client";

import { UserDetailContext } from '@/context/UserDetailsContext';
import { supabase } from '@/services/supabase';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

function Provider({ children }) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState(null);

    useEffect(() => {
        if (user) {
            createNewUser();
        }
    }, [user]);

    const createNewUser = async () => {
        const email =
            user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
        const name = user?.fullName || "User";

        if (!email) {
            console.warn("❌ No email found on Clerk user");
            return;
        }

        // ✅ Check if user already exists
        let { data: users, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .limit(1);

        if (fetchError) {
            console.error("❌ Fetch error:", fetchError);
            return;
        }

        if (!users || users.length === 0) {
            // ✅ Insert if not found
            const { data: inserted, error: insertError } = await supabase
                .from("users")
                .insert([
                    {
                        name,
                        email,
                        credit: 3,
                        subscription: "free",
                    },
                ])
                .select();

            if (insertError) {
                console.error("❌ Insert error:", insertError);
                return;
            }

            console.log("✅ User inserted:", inserted[0]);
            setUserDetail(inserted[0]);
        } else {
            console.log("✅ User already exists:", users[0]);
            setUserDetail(users[0]);
        }
    };

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div className="w-full">{children}</div>
        </UserDetailContext.Provider>
    );
}

export default Provider;
