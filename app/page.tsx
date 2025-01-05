
"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function VideoPage() {
   const [preview,setPreview] =useState('')
    const reader = new FileReader();

    const onChange = (e:any) => {

        const file = e.target.files[0];
        reader.onloadend = () => {
            console.log(reader.result);
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
    return (
        <div>
           <Input type="file" onChange={onChange} />
           {preview && <video src={preview} />}
        </div>
    );
}