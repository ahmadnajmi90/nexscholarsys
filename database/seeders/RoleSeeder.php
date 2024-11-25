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
            'is_profile_complete' => 1,
            ]);

        $postgraduate = User::create([
            'name' => 'Postgraduate',
            'email' => 'postgraduate@example.com',
                'password' => bcrypt('password'),
            ]);

        $postgraduate->assign('postgraduate');

        $academician = User::create([
            'name' => 'Academician',
            'email' => 'academician@example.com',
                'password' => bcrypt('password'),
            ]);
        $academician->assign('academician');

        Bouncer::ability()->firstOrCreate([
            'name' => 'post-grants',
            'title' => 'Post Grants',
        ]);

        Bouncer::ability()->firstOrCreate([
            'name' => 'post-projects',
            'title' => 'Post Projects',
        ]);

        Bouncer::ability()->firstOrCreate([
            'name' => 'post-events',
            'title' => 'Post Events',
        ]);

        Bouncer::allow('academician')->to('post-grants');
        Bouncer::allow('industry')->to('post-grants');
        Bouncer::allow('admin')->to('post-grants');
        Bouncer::disallow('postgraduate')->to('post-grants');

        Bouncer::allow('academician')->to('post-projects');
        Bouncer::allow('industry')->to('post-projects');
        Bouncer::allow('admin')->to('post-projects');
        Bouncer::disallow('postgraduate')->to('post-projects');

        Bouncer::allow('academician')->to('post-events');
        Bouncer::allow('industry')->to('post-events');
        Bouncer::allow('admin')->to('post-events');
        Bouncer::disallow('postgraduate')->to('post-events');

    }
}
