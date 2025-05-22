import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view your profile");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${serverUrl}/api/user/profile`, {
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg)$/)) {
      toast.error("Please upload a JPG/JPEG image only");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to upload profile picture");
        return;
      }

      toast.promise(
        fetch(`${serverUrl}/api/user/upload-profile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to upload profile picture");
          }
          const data = await response.json();
          setUser((prev) => (prev ? { ...prev, image: data.imageUrl } : null));
          return data;
        }),
        {
          loading: "Uploading profile picture...",
          success: "Profile picture updated successfully!",
          error: "Failed to upload profile picture"
        }
      );
    } catch (error) {
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
      <div className="flex justify-center items-center min-h-screen ">
        <Card className="py-10 sm:w-[350px] w-[300px] bg-[#f7f8fa]">
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
      <Card className="p-4 sm:w-[350px] w-[300px] bg-[#f7f8fa]">
        <CardContent className="space-y-4">
          <div
            className="flex justify-center mb-4 relative group cursor-pointer"
            role="img"
            aria-label="Profile picture"
            onClick={handleImageClick}
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
            <div className="absolute sm:top-1 sm:right-22 top-2 right-16 bg-white rounded-full p-1 shadow-md border border-gray-200">
              <Pencil className="w-4 h-4 text-gray-600" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg"
              className="hidden"
            />
          </div>
          {isUploading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
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
