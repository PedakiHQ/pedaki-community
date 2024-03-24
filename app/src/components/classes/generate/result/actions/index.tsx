import { DisplayActions } from './display';
import ResultActions from './validate';

export const Actions = () => {
  return (
    <div className="flex items-center space-x-4">
      <DisplayActions />
      <ResultActions />
    </div>
  );
};
