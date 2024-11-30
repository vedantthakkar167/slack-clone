import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google"
import Github from "@auth/core/providers/github"
import {Password} from "@convex-dev/auth/providers/Password"
import {DataModel} from "./_generated/dataModel"

const CustomPassword=Password<DataModel>({
  profile(params){
    return {
      email:params.email as string,
      name:params.name as string,
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword,Github,Google],
});
