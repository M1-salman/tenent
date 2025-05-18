import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { FormSuccess } from "@/components/FormSuccess";
import { BackButton } from "./BackButton";

export default function SuccessCard({ success }: { success: string }) {
  return (
    <div className="flex justify-center items-center min-h-screen pt-6" role="alert" aria-live="polite">
      <Card className="sm:w-[450px] w-[350px] mb-8 bg-[#f7f8fa]">
       

        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <FormSuccess message={success} />
          <p className="text-center text-gray-600" aria-label="Next steps">
            You can now log in to your account and start using our services.
          </p>
        </CardContent>

        <CardFooter>
          <BackButton 
            label="Go to Login" 
            href="/auth/login"
            aria-label="Proceed to login page" 
          />
        </CardFooter>
      </Card>
    </div>
  );
}
