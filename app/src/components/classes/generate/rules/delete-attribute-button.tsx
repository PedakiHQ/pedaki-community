import {Tooltip, TooltipContent, TooltipPortal, TooltipTrigger} from "@pedaki/design/ui/tooltip";
import {Button} from "@pedaki/design/ui/button";
import {IconTrash} from "@pedaki/design/ui/icons";
import React from "react";

export const DeleteAttributeButton = ({ onClick, type }: {onClick: (() => void) | null, type: 'filter' | 'attribute'}) => {
    const isDisabled = !onClick;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
          <span>
              <Button
                  variant="ghost-error"
                  size="icon"
                  className="h-6 w-6 p-0"
                  disabled={isDisabled}
                  onClick={isDisabled ? undefined : onClick}
              >
                  <IconTrash className="h-4 w-4" />
              </Button>
          </span>
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent>
                    {isDisabled ? 'Impossible de supprimer cet attribut' : 'Supprimer cet attribut'}
                </TooltipContent>
            </TooltipPortal>
        </Tooltip>
    );
}