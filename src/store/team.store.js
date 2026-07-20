import { create } from 'zustand';

export const useTeamStore = create((set) => ({
    teams: [],
    setTeams: (teams) => set({ teams })
}));

export default useTeamStore;
