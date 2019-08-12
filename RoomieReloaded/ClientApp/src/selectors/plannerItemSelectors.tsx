import { RootState } from '../reducers';

export const getPlannerGroups = (state:RootState) => state.plannerGroups.groups;
export const getPlannerItems = (state:RootState) => state.plannerItems.items;