import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { FormError } from "@/components/FormError";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your profile");
          setIsLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setError("Unable to load profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="py-10 sm:w-[350px] w-[300px]">
          <CardHeader className="flex justify-center">
            <FormError message={error} />
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={handleGoToLogin} variant="default">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col space-y-20 items-center justify-center pt-32 px-8 landing"
      role="main"
      aria-label="User profile"
    >
      <Card className="p-4 sm:w-[350px] w-[300px]">
        <CardContent className="space-y-4">
          <div
            className="flex justify-center mb-4"
            role="img"
            aria-label="Profile picture"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={`${user.firstName}'s profile picture`}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center"
                aria-hidden="true"
              >
                <User className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xl font-semibold">
              Name
            </Label>
            <h2 id="name" className="text-gray-600">
              {user?.firstName || "Not provided"} {user?.lastName || ""}
            </h2>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xl font-semibold">
              Email
            </Label>
            <h2 id="email" className="text-gray-600">
              {user?.email || "Not provided"}
            </h2>
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          <Button
            type="button"
            variant="default"
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600"
            aria-label="Logout from your account"
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
