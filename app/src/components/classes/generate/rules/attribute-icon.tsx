import React from 'react';
import {ATTRIBUTES_COLORS} from "~/components/classes/generate/rules/constants.ts";

export const AttributeIcon = ({index}: {index: number}) => {
    return (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full"
             style={{ backgroundColor: ATTRIBUTES_COLORS[index] }}
        >
        <span className="text-sub-sm font-medium">
            {String.fromCharCode(65 + index)}
        </span>
        </div>
    );
}

export default AttributeIcon;