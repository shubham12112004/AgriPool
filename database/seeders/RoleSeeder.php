<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = ['farmer','driver','equipment_owner','buyer','admin'];
        $rows = array_map(fn($r) => ['name' => $r, 'created_at' => now(), 'updated_at' => now()], $roles);
        DB::table('roles')->insertOrIgnore($rows);
    }
}
