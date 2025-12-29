'use client';

import { Suspense } from "react";
import OAuth2Callback from "@/components/OAuth2Callback";

export default function OAuthPage() {
  return (
    <Suspense fallback={<div>Loading OAuth...</div>}>
        <OAuth2Callback />
    </Suspense> 
  );
}
