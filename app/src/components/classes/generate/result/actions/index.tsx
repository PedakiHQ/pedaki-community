import { DisplayActions } from './display';
import { SortActions } from './sort';
import ResultActions from './validate';

export const Actions = () => {
  return (
    <div className="flex items-center space-x-4">
      <SortActions />
      <DisplayActions />
      <ResultActions />
    </div>
  );
};
