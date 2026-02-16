import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TabletDevice } from '@/types/tablets';
import { Participant } from '@/types/participants';
import { IssuanceRecord, CheckOutData, CheckInData } from '@/types/issuance';
import { mockTablets } from '@/data/mockdata';
import { mockParticipants } from '@/data/mockdata';

interface TabletStore {
    // State
    tablets: TabletDevice[];
    participants: Participant[];
    issuances: IssuanceRecord[];
    lastUpdated: string;

    // Tablet Actions
    addTablet: (tablet: TabletDevice) => void;
    updateTablet: (id: string, updates: Partial<TabletDevice>) => void;
    deleteTablet: (id: string) => void;
    getTabletById: (id: string) => TabletDevice | undefined;
    getAvailableTablets: () => TabletDevice[];

    // Participant Actions
    addParticipant: (participant: Participant) => void;
    updateParticipant: (id: string, updates: Partial<Participant>) => void;
    deleteParticipant: (id: string) => void;
    getParticipantById: (id: string) => Participant | undefined;

    // Issuance Actions
    checkoutTablet: (data: CheckOutData) => IssuanceRecord | null;
    checkinTablet: (data: CheckInData) => boolean;
    getActiveIssuances: () => IssuanceRecord[];
    getIssuanceByParticipant: (participantId: string) => IssuanceRecord | undefined;
    getIssuanceByTablet: (tabletId: string) => IssuanceRecord | undefined;

    // Utility Actions
    resetStore: () => void;
    refreshData: () => void;
}

const initialState = {
    tablets: mockTablets.map(t => ({
        ...t,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })),
    participants: mockParticipants,
    issuances: [] as IssuanceRecord[],
    lastUpdated: new Date().toISOString(),
};

export const useTabletStore = create<TabletStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Tablet Actions
            addTablet: (tablet) =>
                set((state) => ({
                    tablets: [...state.tablets, tablet],
                    lastUpdated: new Date().toISOString(),
                })),

            updateTablet: (id, updates) =>
                set((state) => ({
                    tablets: state.tablets.map((t) =>
                        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
                    ),
                    lastUpdated: new Date().toISOString(),
                })),

            deleteTablet: (id) =>
                set((state) => ({
                    tablets: state.tablets.filter((t) => t.id !== id),
                    lastUpdated: new Date().toISOString(),
                })),

            getTabletById: (id) => get().tablets.find((t) => t.id === id || t.deviceId === id),

            getAvailableTablets: () =>
                get().tablets.filter((t) => t.status === 'available'),

            // Participant Actions
            addParticipant: (participant) =>
                set((state) => ({
                    participants: [...state.participants, participant],
                    lastUpdated: new Date().toISOString(),
                })),

            updateParticipant: (id, updates) =>
                set((state) => ({
                    participants: state.participants.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                    lastUpdated: new Date().toISOString(),
                })),

            deleteParticipant: (id) =>
                set((state) => ({
                    participants: state.participants.filter((p) => p.id !== id),
                    lastUpdated: new Date().toISOString(),
                })),

            getParticipantById: (id) => get().participants.find((p) => p.id === id),

            // Issuance Actions
            checkoutTablet: (data: CheckOutData) => {
                const { tablets, participants, issuances } = get();

                // Find tablet and participant
                const tablet = tablets.find((t) => t.id === data.tabletId || t.deviceId === data.tabletId);
                const participant = participants.find((p) => p.id === data.participantId);

                if (!tablet) {
                    console.error('Tablet not found:', data.tabletId);
                    return null;
                }

                if (!participant) {
                    console.error('Participant not found:', data.participantId);
                    return null;
                }

                if (tablet.status !== 'available') {
                    console.error('Tablet is not available:', tablet.status);
                    return null;
                }

                // Check if participant already has an active issuance
                const existingIssuance = issuances.find(
                    (i) => i.participantId === data.participantId && i.status === 'active'
                );

                if (existingIssuance) {
                    console.error('Participant already has an active issuance');
                    return null;
                }

                // Create issuance record
                const issuance: IssuanceRecord = {
                    id: `ISS-${Date.now()}`,
                    participantId: data.participantId,
                    participantName: participant.name,
                    tabletId: tablet.deviceId,
                    tabletModel: tablet.model,
                    checkoutDate: new Date().toISOString(),
                    expectedReturnDate: data.expectedReturnDate,
                    checkoutLocation: data.location,
                    checkoutBy: 'System', // Replace with actual user
                    status: 'active',
                    notes: data.notes,
                    activity: data.activity,
                };

                // Update tablet status
                set((state) => ({
                    tablets: state.tablets.map((t) =>
                        t.id === tablet.id
                            ? {
                                ...t,
                                status: 'issued' as const,
                                assignedTo: participant.name,
                                assignedActivity: data.activity,
                                location: data.location,
                                updatedAt: new Date().toISOString(),
                            }
                            : t
                    ),
                    participants: state.participants.map((p) =>
                        p.id === data.participantId
                            ? {
                                ...p,
                                status: 'active' as const,
                                tabletsIssued: (p.tabletsIssued || 0) + 1,
                                tabletSerial: tablet.deviceId,
                                tabletModel: tablet.model,
                                tabletStatus: 'active' as const,
                                issueDate: new Date().toISOString().split('T')[0],
                                expectedReturnDate: data.expectedReturnDate,
                                lastActivity: new Date().toISOString().split('T')[0],
                            }
                            : p
                    ),
                    issuances: [...state.issuances, issuance],
                    lastUpdated: new Date().toISOString(),
                }));

                return issuance;
            },

            checkinTablet: (data: CheckInData) => {
                const { issuances, tablets } = get();

                const issuance = issuances.find((i) => i.id === data.issuanceId);

                if (!issuance) {
                    console.error('Issuance not found:', data.issuanceId);
                    return false;
                }

                if (issuance.status !== 'active') {
                    console.error('Issuance is not active:', issuance.status);
                    return false;
                }

                const tablet = tablets.find((t) => t.deviceId === issuance.tabletId);

                if (!tablet) {
                    console.error('Tablet not found:', issuance.tabletId);
                    return false;
                }

                // Update issuance record
                set((state) => ({
                    issuances: state.issuances.map((i) =>
                        i.id === data.issuanceId
                            ? {
                                ...i,
                                actualReturnDate: data.actualReturnDate,
                                checkinLocation: data.location,
                                checkinBy: 'System', // Replace with actual user
                                status: 'returned' as const,
                                notes: data.notes ? `${i.notes || ''}\n${data.notes}` : i.notes,
                            }
                            : i
                    ),
                    tablets: state.tablets.map((t) =>
                        t.deviceId === issuance.tabletId
                            ? {
                                ...t,
                                status: 'available' as const,
                                assignedTo: null,
                                assignedActivity: null,
                                location: data.location,
                                condition: data.condition || t.condition,
                                updatedAt: new Date().toISOString(),
                            }
                            : t
                    ),
                    participants: state.participants.map((p) =>
                        p.id === issuance.participantId
                            ? {
                                ...p,
                                tabletsReturned: (p.tabletsReturned || 0) + 1,
                                tabletStatus: 'returned' as const,
                                actualReturnDate: data.actualReturnDate,
                                lastActivity: new Date().toISOString().split('T')[0],
                            }
                            : p
                    ),
                    lastUpdated: new Date().toISOString(),
                }));

                return true;
            },

            getActiveIssuances: () =>
                get().issuances.filter((i) => i.status === 'active'),

            getIssuanceByParticipant: (participantId) =>
                get().issuances.find(
                    (i) => i.participantId === participantId && i.status === 'active'
                ),

            getIssuanceByTablet: (tabletId) =>
                get().issuances.find(
                    (i) => i.tabletId === tabletId && i.status === 'active'
                ),

            // Utility Actions
            resetStore: () => set(initialState),

            refreshData: () =>
                set((state) => ({
                    ...state,
                    lastUpdated: new Date().toISOString(),
                })),
        }),
        {
            name: 'tablet-store',
            version: 1,
        }
    )
);
