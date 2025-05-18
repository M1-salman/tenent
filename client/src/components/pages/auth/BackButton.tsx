"use client";
//imports
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
//interface
interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link to={href}>{label}</Link>
    </Button>
  );
};
