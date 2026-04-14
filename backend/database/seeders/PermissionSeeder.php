<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * All system permissions grouped by module.
     * Add new permissions here as new modules are developed.
     */
    private const PERMISSIONS = [
        // User management
        'user.view',
        'user.create',
        'user.update',
        'user.delete',

        // Role management
        'role.view',
        'role.assign',

        // Profile
        'profile.view',
        'profile.update',

        // Module 02 — Membership application management
        'membership.application.view',
        'membership.application.create',
        'membership.application.review',
        'membership.application.approve',
        'membership.application.reject',
        'membership.application.hold',
        'membership.application.delete',
        'membership.application.restore',

        // Module 02 — Member management
        'member.view',
        'member.create',
        'member.update',
        'member.status.update',

        // Module 03 — Extended member management
        'member.view.detail',
        'member.delete',
        'member.restore',
        'member.export',
        'member.summary.view',
    ];

    public function run(): void
    {
        // Use web guard — Sanctum resolves against it for API token auth
        foreach (self::PERMISSIONS as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $this->command->info('Permissions seeded: '.count(self::PERMISSIONS).' permissions.');
    }
}
