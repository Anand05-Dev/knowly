"use client";
import { UserDetailContext } from '@/context/UserDetailsContext';
import { supabase } from '@/services/supabase';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

function Provider({ children }) {
    const { user } = useUser();
    const [userDetail,setUserDetail]=useState();
    useEffect(() => {
        if (user) {
          CreateNewUser();
        }
      }, [user]);
    const CreateNewUser = async () => {
        //If user Already exsits?
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', user?.primaryEmailAddress.emailAddress);

            console.log(users);

        if (users.length == 0) {
            const { data, error } = await supabase
                .from('users')
                .insert([
                    { name: user?.fullName,
                        email: user?.primaryEmailAddress.emailAddress 
                    },
                ])
                .select()
                console.log(data);
                setUserDetail(data[0]);

                return ;
        }
        setUserDetail(users[0]);

    }
    return (
        <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
        <div className='w-full'>
            {children}
        </div>
        </UserDetailContext.Provider>
    )
}

export default Provider
