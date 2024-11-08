import React from "react";
import { ScrollArea } from "../ShadcnComponents/ScrollArea";
import { Separator } from "../ShadcnComponents/Separator";
import "./Dashboard.css";
import { Header } from "semantic-ui-react";

const RecentActivity = () => {
  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );
  return (
    <div className="Recent-Activity-Container">
      <Header>Recent Activity</Header>
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
          {tags.map((tag) => (
            <>
              <div key={tag} className="text-sm">
                {tag}
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentActivity;
