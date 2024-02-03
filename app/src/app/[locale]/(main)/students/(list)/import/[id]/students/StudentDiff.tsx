'use client';

import {Card} from '@pedaki/design/ui/card';
import {Separator} from '@pedaki/design/ui/separator';
import {Sheet, SheetContent, SheetTrigger} from '@pedaki/design/ui/sheet';
import {Skeleton} from '@pedaki/design/ui/skeleton';
import {useIdParam} from '~/components/students/import/parameters.ts';
import Client from '~/components/students/list/client.tsx';
import type {StudentData} from '~/components/students/list/columns.tsx';
import {api} from '~/server/clients/client.ts';
import type {OutputType} from '~api/router/router.ts';
import React, {Suspense} from 'react';

interface StudentDiffProps {
    importId: string;
}

const StudentDiff = ({importId}: StudentDiffProps) => {
    const [selected] = useIdParam();

    return (
        <Suspense fallback={<SuspenseCard/>}>
            {selected === null ? <NoContent/> : <ContentWrapper importId={importId} id={selected}/>}
        </Suspense>
    );
};

const SuspenseCard = () => {
    return <Skeleton className="border"/>;
};

const NoContent = () => {
    return <Card className="h-full w-full">No content</Card>;
};

const ContentWrapper = ({importId, id}: StudentDiffProps & { id: number }) => {
    const [result, {isError, isLoading}] = api.students.imports.students.getOne.useSuspenseQuery({
        importId,
        id,
    });


    const [existingDataId, setExistingDataId] = React.useState<number | null>(null);

    const {data: customExistingData } = api.students.imports.students.getPossibleStudentData.useQuery({
        studentId: existingDataId!,
    }, {
        enabled: existingDataId !== null,
    });

    const existingData = customExistingData?.current ?? result?.current ?? null;

    if (isLoading || isError) {
        return <SuspenseCard/>;
    }

    return <Content result={result} existingData={existingData} setExistingDataId={setExistingDataId}/>;
};

const Content = ({
                     result,
                     existingData,
                     setExistingDataId,
                 }: {
    result: OutputType['students']['imports']['students']['getOne'];
    existingData: OutputType['students']['imports']['students']['getPossibleStudentData']['current'] | null;
    setExistingDataId: (id: number | null) => void;
}) => {
    return (
        <Card className="flex h-full w-full flex-row">
            <div className="flex-1">
                <h3 className="text-label-sm text-soft">
                    {/*    TODO */}
                    Donnée importée
                </h3>
                <p className="text-label-sm text-soft">
                    {result.import.firstName} {result.import.lastName}
                </p>
            </div>
            <Separator orientation="vertical"/>
            <div className="flex-1">
                <div>
                    <h3 className="text-label-sm text-soft">
                        {/*    TODO */}
                        Donnée existante
                    </h3>
                    <SelectAnotherBaseStudent setExistingDataId={setExistingDataId}/>
                </div>
                <div>
                    <pre>
                        {JSON.stringify(existingData, null, 2)}
                    </pre>
                </div>
            </div>
        </Card>
    );
};

const SelectAnotherBaseStudent = ({
                                      setExistingDataId,
                                  }: {
    setExistingDataId: (id: number | null) => void;
}) => {
    const [open, setOpen] = React.useState(false);

    const onClickRow = (row: StudentData) => {
        setExistingDataId(row.id);
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="text-label-sm text-soft hover:underline">
                {/*TODO trads*/}
                Sélectionner un autre élève
            </SheetTrigger>
            <SheetContent
                side="right"
                className="md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
                onOpenAutoFocus={e => e.preventDefault()}
            >
                <div className="h-full p-4">
                    <Client onClickRow={onClickRow}/>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default StudentDiff;
