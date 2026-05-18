import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

function EmptyComponent({ title, description, buttonText, buttonLink }) {
  const navigate = useNavigate();

  return (
    <Empty className="w-full h-full flex justify-center items-center">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => navigate(buttonLink)}>{buttonText}</Button>
      </EmptyContent>
    </Empty>
  );
}

export default EmptyComponent;
