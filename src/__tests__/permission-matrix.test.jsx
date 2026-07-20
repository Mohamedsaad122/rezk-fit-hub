import { describe, it, expect } from 'vitest';

// Simulating the resolution function
function resolvePermissions({ role, teamIds = [], customOverrides = {} }, rolePermissions, teamPermissionsRegistry) {
    // 1. Start with base role permissions
    let permissions = {};
    if (rolePermissions[role]) {
        Object.entries(rolePermissions[role]).forEach(([mod, actions]) => {
            permissions[mod] = [...actions];
        });
    }

    // 2. Union with team-level inherited permissions
    teamIds.forEach(teamId => {
        const teamPerms = teamPermissionsRegistry[teamId] || {};
        Object.entries(teamPerms).forEach(([moduleName, actions]) => {
            const existing = permissions[moduleName] || [];
            permissions[moduleName] = Array.from(new Set([...existing, ...actions]));
        });
    });

    // 3. Apply custom overrides (memberId overrides)
    Object.entries(customOverrides).forEach(([moduleName, actions]) => {
        const existing = permissions[moduleName] || [];
        permissions[moduleName] = Array.from(new Set([...existing, ...actions]));
    });

    return permissions;
}

describe('Sprint 5.1 Permission Resolution Matrix Engine', () => {
    const mockRolePermissions = {
        'Owner': {
            Dashboard: ['View', 'Create', 'Update', 'Delete', 'Export', 'Manage'],
            Clients: ['View', 'Create', 'Update', 'Delete', 'Export', 'Manage']
        },
        'Coach': {
            Dashboard: ['View'],
            Clients: ['View', 'Create', 'Update']
        },
        'Viewer': {
            Dashboard: ['View'],
            Clients: ['View']
        }
    };

    const mockTeamPermissionsRegistry = {
        1: { // Team 1: Advanced training team inherits extra capabilities
            Clients: ['Export', 'Manage']
        },
        2: { // Team 2: Specialized diet planning
            Nutrition: ['View', 'Create', 'Update']
        }
    };

    it('should resolve base role permissions for a member', () => {
        const member = { role: 'Viewer', teamIds: [] };
        const resolved = resolvePermissions(member, mockRolePermissions, mockTeamPermissionsRegistry);

        expect(resolved.Clients).toContain('View');
        expect(resolved.Clients).not.toContain('Create');
        expect(resolved.Clients).not.toContain('Export');
    });

    it('should inherit team-level permissions based on team membership', () => {
        const member = { role: 'Viewer', teamIds: [1, 2] };
        const resolved = resolvePermissions(member, mockRolePermissions, mockTeamPermissionsRegistry);

        // From Viewer role
        expect(resolved.Dashboard).toContain('View');
        // Inherited from Team 1
        expect(resolved.Clients).toContain('Export');
        expect(resolved.Clients).toContain('Manage');
        // Inherited from Team 2
        expect(resolved.Nutrition).toContain('View');
        expect(resolved.Nutrition).toContain('Create');
    });

    it('should merge custom overrides on top of role and inherited permissions', () => {
        const member = { 
            role: 'Coach', 
            teamIds: [2], 
            customOverrides: {
                Dashboard: ['Export']
            } 
        };
        const resolved = resolvePermissions(member, mockRolePermissions, mockTeamPermissionsRegistry);

        // From Coach role
        expect(resolved.Clients).toContain('Create');
        // Inherited from Team 2
        expect(resolved.Nutrition).toContain('Update');
        // Custom overrides
        expect(resolved.Dashboard).toContain('Export');
    });
});
