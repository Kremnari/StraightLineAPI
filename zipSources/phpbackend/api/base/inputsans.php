<?php

$_input = json_decode(file_get_contents('php://input'), TRUE);
if(count($_input)==0) {
    if($_SERVER['REQUEST_METHOD']==='GET') {
        $_input = $_GET;
    } else if($_SERVER['REQUEST_METHOD']==='POST') {
        $_input = $_POST;
    }
}

if(isset($_input['debug'])) {
    error_reporting(E_ALL | E_STRICT);
    ini_set('display_errors', 'on');
}
