import { useState } from "react";
import { DateField } from "src/components/controls/date/date_field.tsx";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { DateSelector } from "src/components/controls/date/date_selector.tsx";

export default {
  title: "Controls/DateField",
  component: DateField,
};

export function Baseline(){
  const [adapter] = useState(()=>{
    return new DateFieldAdapter("Birthday", new Date(1982, 5, 11));
  });
  return <DateField adapter={adapter} />
}

export function Selector(){
  const [adapter] = useState(()=>{
    return new DateFieldAdapter("Birthday", new Date(1982, 5, 11));
  });
  return <DateSelector adapter={adapter} />
}