"use client";

import Link from "next/link";
import { logUserAction } from '../../data/actions/auth';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/app/components/ui/card";

import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

export function SigninForm() {
  return (
    <div className="w-full max-w-md">
      <form action={logUserAction}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Username or Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <button className="w-full">Sign In</button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Dont have an account?
          <Link className="underline ml-2" href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}