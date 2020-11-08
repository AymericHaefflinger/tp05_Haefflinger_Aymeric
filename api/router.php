<?php

use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

return function (App $app){

    $app->get('/', "App\controller\homeController:home"); 

    $app->group('/user', function(Group $group){
        $group->post('/login', "App\controller\userController:login");
        $group->post('/register', "App\controller\userController:register");
    });

};


