import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "./BackButton";

// interface
interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
}

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  headerTitle,
}: CardWrapperProps) => {
  return (
    <Card className="sm:w-[450px] w-[350px] mb-8 bg-[#f7f8fa]">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-bold">
          {headerTitle}
        </CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
