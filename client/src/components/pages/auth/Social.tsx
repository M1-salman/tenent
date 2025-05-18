import { Button } from "@/components/ui/button";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";

export const Social = () => {
  return (
    <div className="flex items-center justify-center space-x-3 pt-7" role="group" aria-label="Social login options">
      <Button
        size="lg"
        className=" xs:px-[20px] sm:px-[30px] md:px-[40px] lg:px-[50px] rounded-[5px] border-none hover:bg-[#d3c0fc] transition duration-300 bg-[#b593ff]  text-md"
        variant="outline"
        aria-label="Continue with Google"
      >
        <IconBrandGoogle className="h-6 w-6 mr-2" aria-hidden="true" /> Google
      </Button>

      <Button
        size="lg"
        className="xs:px-[20px] sm:px-[30px] md:px-[40px] lg:px-[55px] font-medium transition duration-300 hover:bg-[#d3c0fc] rounded-[5px] border-none text-md bg-[#b593ff]"
        variant="outline"
        aria-label="Continue with GitHub"
      >
        <IconBrandGithub className="h-6 w-6 mr-2" aria-hidden="true" /> <span>Github</span>
        <BottomGradient />
      </Button>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
