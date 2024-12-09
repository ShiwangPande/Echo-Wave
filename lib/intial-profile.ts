import {currentUser , auth } from "@clerk/nextjs/server"

import {db} from "@/lib/db";

export const initialProfile = async ()=>{
    const user = await currentUser();
    const {  redirectToSignIn } = await auth()
    if(!user){
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where:{
            userId: user.id
        }
    });
    const email = user.emailAddresses?.[0]?.emailAddress;

    // If no email exists, handle the case (you could throw an error or return a default profile)
    if (!email) {
      throw new Error("User does not have a valid email address.");
    }
  
    if(profile){
        return profile;
    }

    const newProfile = await db.profile.create({
        data:{
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: email
        }
    });

    return newProfile;
}