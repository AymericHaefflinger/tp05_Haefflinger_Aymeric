<?php

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

use Firebase\JWT\JWT;

class userController
{

    public function login(Request $request, Response $response, array $args): Response
    {
        $user = $request->getParsedBody();
        
        $login = $user["login"] ?? "";
        $mdp = $user["mdp"] ?? "";

        if($login != $_ENV["ADMIN_LOGIN"] || $mdp != $_ENV["ADMIN_MDP"]){

        $response->getBody()->write(json_encode([
            "success" => false,
        ]));
        return $response
            ->withHeader("Content-Type", "application/json");;
        }

        $issuedAt = time();

        $payload = [
            "user" => [
                "id" => 1,
                "email" => "aymeric@email.com"
            ],
            "iat" => $issuedAt,
            "exp" => $issuedAt + 60
        ];

        $tokenJWT = JWT::encode($payload, $_ENV["JWT_SECRET"], "HS256");

        $response->getBody()->write(json_encode([
            "success" => true
        ]));
        return $response
            ->withHeader("Authorization", $tokenJWT)
            ->withHeader("Content-Type", "application/json");
    }

    public function register(Request $request, Response $response, array $args): Response
    {
        $user = $request->getParsedBody();
        
        $result = [
            "success" => true,
            "user" => $user
        ];

        $response->getBody()->write(json_encode($result));
        return $response
            ->withHeader("Content-Type", "application/json");
    }

}