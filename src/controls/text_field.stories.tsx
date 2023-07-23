import { useState } from "react";
import { TextField } from "src/controls/text_field.tsx";
import { TextFieldAdapter } from "src/controls/text_field_adapter.ts";

export default {
  title: "TextField",
  component: TextField,
};

export function Base(){
  const [adapter] = useState(()=>{
    return new TextFieldAdapter("Name", "");
  })
    return <TextField adapter={adapter}></TextField>
}