<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

use Bouncer;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'ahmadnajmi.an@utm.my',
             'password' => bcrypt('password'),
            ]);

            Bouncer::allow($admin)->to('create-user');

        // Assign the Admin role to the user
        $admin->assign('admin');

        User::create([
            'name' => 'Academician',
            'email' => 'ahmadnajmi.acac@utm.my',
             'password' => bcrypt('password'),
            ]);

        $postgraduate = User::create([
            'name' => 'Postgraduate',
            'email' => 'postgraduate@example.com',
                'password' => bcrypt('password'),
            ]);

            Bouncer::disallow($postgraduate)->to('post-grants'); // Disallow the postgraduate user to create post grants
        $postgraduate->assign('postgraduate');

        $academician = User::create([
            'name' => 'Academician',
            'email' => 'academician@example.com',
                'password' => bcrypt('password'),
            ]);
        $academician->assign('academician');

    }
}
