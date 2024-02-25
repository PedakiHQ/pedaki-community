"use client"

import {useFilterParams} from "~/components/datatable/client.tsx";
import {searchParams} from "~/components/students/list/parameters.ts";
import {useRulesParams} from "~/components/classes/generate/parameters.tsx";
import {useClassesGenerateStore} from "~/store/classes/generate/generate.store.ts";
import { useDebounce } from "@uidotdev/usehooks";

const RefetchQueryAction = () => {

    const [_filters] = useFilterParams(searchParams);
    const [_rules] = useRulesParams();
    const hasEdited = useClassesGenerateStore(store => store.hasEdited);

    const [filters, rules] = useDebounce([_filters, _rules], 200);
    console.log({filters, rules, hasEdited})


    return (
        <pre>
            {JSON.stringify({filters, rules, hasEdited}, null, 2)}
        </pre>
    )
};

export default RefetchQueryAction;