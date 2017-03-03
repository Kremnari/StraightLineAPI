<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if(count($_GET['files'])==0) {
    echo 'StraightLine - Builder Source Repository<br>',
        'TODO: A blank request would return what this endpoint supports<br>',
        'This one currently supports:<br>',
        'mongo: MongoDB interface<br>',
        'php: PHP Server side interface<br>',
        '<br>Authentication fields required: none<br>',
        'Authentication will be used to restrict Repo use<br>',
        '<br>Ultimately these would be provided through json as well<br>',
        'so they can be read and parsed by the Straightline Client';
    die();
}
if(isset($_GET['info'])) {
    $out = ['php'=>[
                'builder'=>'phpViewer/phpBuilder.js',
                'options'=>'builders/phpBuilder.html'
            ],
            'mongo'=>[
                'builder'=>'builders/mongoBuilder.js',
                'options'=>'builders/mongoBuilder.html'
            ]];
    
    echo json_encode($out);
    die();
}


$srcdirs = ['php'  =>'phpbackend/ ',
        'mongo'=>'mongodb/ '];
$cmd = 'zip -r - ';
foreach(array_unique($_GET['files']) as $each) {
    $cmd .= $srcdirs[$each];
}


$fp = popen($cmd, 'r');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="sources.zip"');
$bufsize = 8192;
$buff = '';
while( !feof($fp)) {
    $buff = fread($fp, $bufsize);
    echo $buff;
    
}
pclose($fp);
