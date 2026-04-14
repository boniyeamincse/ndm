<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $superadmin = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'admin',      'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'member',     'guard_name' => 'web']);

        // Assign all permissions to superadmin
        $allPermissions = Permission::all();
        $superadmin->syncPermissions($allPermissions);

        // Suggested baseline committee permissions for admin role
        $adminCommitteePermissions = [
            'committee.type.view',
            'committee.view',
            'committee.view.detail',
            'committee.create',
            'committee.update',
            'committee.status.update',
            'committee.summary.view',
        ];
        $admin->givePermissionTo($adminCommitteePermissions);

        // Suggested baseline position permissions for admin role
        $adminPositionPermissions = [
            'position.view',
            'position.view.detail',
            'position.create',
            'position.update',
            'position.status.update',
            'position.summary.view',
            'position.committee-type.map',
        ];
        $admin->givePermissionTo($adminPositionPermissions);

        $this->command->info('Roles seeded: superadmin, admin, member.');
        $this->command->info('Superadmin assigned '.count($allPermissions).' permissions.');
    }
}
