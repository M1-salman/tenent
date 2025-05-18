import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "./BackButton";
import { Social } from "./Social";

// interface
interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  showSocial,
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
      {/* If showSocial display it */}
      {showSocial && (
        <CardFooter className="flex items-center justify-center">
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
