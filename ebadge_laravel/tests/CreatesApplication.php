<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use \Illuminate\Container\Container as Container;
use \Illuminate\Support\Facades\Facade as Facade;

trait CreatesApplication
{
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        $app->singleton('app', 'Illuminate\Container\Container');

        Facade::setFacadeApplication($app);

        return $app;
    }
}
