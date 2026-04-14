<?php

namespace App\Providers;

use App\Models\Member;
use App\Models\MembershipApplication;
use App\Models\Committee;
use App\Models\CommitteeType;
use App\Models\Position;
use App\Policies\CommitteePolicy;
use App\Policies\CommitteeTypePolicy;
use App\Policies\PositionPolicy;
use App\Policies\MemberPolicy;
use App\Policies\MembershipApplicationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(MembershipApplication::class, MembershipApplicationPolicy::class);
        Gate::policy(Member::class, MemberPolicy::class);
        Gate::policy(CommitteeType::class, CommitteeTypePolicy::class);
        Gate::policy(Committee::class, CommitteePolicy::class);
        Gate::policy(Position::class, PositionPolicy::class);
    }
}

